package app.hotel.PACK.services;

import app.hotel.PACK.DTO.*;
import app.hotel.PACK.entities.*;
import app.hotel.PACK.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final PersonnelRepository personnelRepository;
    private final ReceptionnisteRepository receptionnisteRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Récupérer tous les utilisateurs
     */
    public List<?> getAllUsers() {
        List<Object> allUsers = new ArrayList<>();
        
        // Ajouter les clients
        allUsers.addAll(clientRepository.findAll()
                .stream()
                .map(this::convertClientToDTO)
                .collect(Collectors.toList()));
        
        // Ajouter les personnels
        allUsers.addAll(personnelRepository.findAll()
                .stream()
                .map(this::convertPersonnelToDTO)
                .collect(Collectors.toList()));
        
        // Ajouter les réceptionnistes
        allUsers.addAll(receptionnisteRepository.findAll()
                .stream()
                .map(this::convertReceptionnisteToDTO)
                .collect(Collectors.toList()));
        
        return allUsers;
    }

    /**
     * Récupérer par type
     */
    public List<?> getUsersByType(String type) {
        if ("CLIENT".equalsIgnoreCase(type)) {
            return clientRepository.findAll()
                    .stream()
                    .map(this::convertClientToDTO)
                    .collect(Collectors.toList());
        } else if ("PERSONNEL".equalsIgnoreCase(type)) {
            return personnelRepository.findAll()
                    .stream()
                    .map(this::convertPersonnelToDTO)
                    .collect(Collectors.toList());
        } else if ("RECEPTIONNISTE".equalsIgnoreCase(type)) {
            return receptionnisteRepository.findAll()
                    .stream()
                    .map(this::convertReceptionnisteToDTO)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    /**
     * Créer un utilisateur
     * Utilise UpdateUserRequestDTO pour la création
     */
    public Object createUser(UpdateUserRequestDTO dto, String userType) {
        if (emailDejaUtilise(dto.getEmail()))
            throw new IllegalArgumentException("Email déjà utilisé");

        String motDePasse = passwordEncoder.encode(dto.getTelephone());

        switch (userType.toUpperCase()) {

            case "CLIENT":
                Client client = new Client();
                client.setNom(dto.getNom());
                client.setPrenom(dto.getPrenom());
                client.setEmail(dto.getEmail());
                client.setTelephone(dto.getTelephone());
                client.setMotDePasse(motDePasse);
                return convertClientToDTO(clientRepository.save(client));

            case "PERSONNEL":
                if (dto.getRoleAffectation() == null || dto.getRoleAffectation().isBlank())
                    throw new IllegalArgumentException("Le rôle du personnel est obligatoire");
                RoleAffectation role;
                try {
                    role = RoleAffectation.valueOf(dto.getRoleAffectation().toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Rôle invalide: " + dto.getRoleAffectation());
                }
                Personnel personnel = new Personnel();
                personnel.setNom(dto.getNom());
                personnel.setPrenom(dto.getPrenom());
                personnel.setEmail(dto.getEmail());
                personnel.setTelephone(dto.getTelephone());
                personnel.setMotDePasse(motDePasse);
                personnel.setType(role); // ✅ Correction bug null
                return convertPersonnelToDTO(personnelRepository.save(personnel));

            case "RECEPTIONNISTE":
                Receptionniste rec = new Receptionniste();
                rec.setNom(dto.getNom());
                rec.setPrenom(dto.getPrenom());
                rec.setEmail(dto.getEmail());
                rec.setTelephone(dto.getTelephone());
                rec.setMotDePasse(motDePasse);
                return convertReceptionnisteToDTO(receptionnisteRepository.save(rec));

            case "ADMIN":
                Administrateur admin = new Administrateur(); // ✅ Plus un Client !
                admin.setNom(dto.getNom());
                admin.setPrenom(dto.getPrenom());
                admin.setEmail(dto.getEmail());
                admin.setTelephone(dto.getTelephone());
                admin.setMotDePasse(motDePasse);
                return convertAdminToDTO(administrateurRepository.save(admin));

            default:
                throw new IllegalArgumentException("Type invalide: " + userType);
        }
    }

    /**
     * Modifier un utilisateur
     */
    public Object updateUser(Integer id, UpdateUserRequestDTO userDTO) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        utilisateur.setNom(userDTO.getNom());
        utilisateur.setPrenom(userDTO.getPrenom());
        utilisateur.setEmail(userDTO.getEmail());
        utilisateur.setTelephone(userDTO.getTelephone());

        Utilisateur updated = utilisateurRepository.save(utilisateur);
        System.out.println("[AdminUserService] ✅ Utilisateur modifié: " + id);

        // Retourner le DTO approprié selon le type
        if (updated instanceof Client) {
            return convertClientToDTO((Client) updated);
        } else if (updated instanceof Receptionniste) {
            return convertReceptionnisteToDTO((Receptionniste) updated);
        } else if (updated instanceof Personnel) {
            return convertPersonnelToDTO((Personnel) updated);
        }

        return updated;
    }

    /**
     * Supprimer un utilisateur (hard delete)
     */
    public void deleteUser(Integer id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new IllegalArgumentException("Utilisateur non trouvé");
        }
        utilisateurRepository.deleteById(id);
        System.out.println("[AdminUserService] ✅ Utilisateur supprimé: " + id);
    }

    /**
     * Créer un administrateur
     */
    public Object createAdmin(UpdateUserRequestDTO adminDTO) {
        return createUser(adminDTO, "ADMIN");
    }

    // ============ Convertisseurs DTO ============

    private ClientDTO convertClientToDTO(Client client) {
        return ClientDTO.builder()
                .id(client.getIdUtilisateur())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .email(client.getEmail())
                .telephone(client.getTelephone())
                .build();
    }

    private PersonnelDTO convertPersonnelToDTO(Personnel personnel) {
        return PersonnelDTO.builder()
                .id(personnel.getIdUtilisateur())
                .nom(personnel.getNom())
                .prenom(personnel.getPrenom())
                .email(personnel.getEmail())
                .telephone(personnel.getTelephone())
                .idPersonnel(personnel.getIdPersonnel())
                .userType("PERSONNEL")
                .build();
    }

    private ReceptionnisteDTO convertReceptionnisteToDTO(Receptionniste receptionniste) {
        return ReceptionnisteDTO.builder()
                .id(receptionniste.getIdUtilisateur())
                .nom(receptionniste.getNom())
                .prenom(receptionniste.getPrenom())
                .email(receptionniste.getEmail())
                .telephone(receptionniste.getTelephone())
                .idReception(receptionniste.getIdReception())
                .userType("RECEPTIONNISTE")
                .build();
    }
}