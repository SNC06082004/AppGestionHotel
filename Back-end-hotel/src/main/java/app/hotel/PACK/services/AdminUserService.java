package app.hotel.PACK.services;

import app.hotel.PACK.DTO.*;
import app.hotel.PACK.entities.*;
import app.hotel.PACK.entities.enums.RoleAffectation;
import app.hotel.PACK.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {

    private final ClientRepository clientRepository;
    private final PersonnelRepository personnelRepository;
    private final ReceptionnisteRepository receptionnisteRepository;
    private final AdministrateurRepository administrateurRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    private boolean emailDejaUtilise(String email) {
        return clientRepository.existsByEmail(email)
            || personnelRepository.existsByEmail(email)
            || receptionnisteRepository.existsByEmail(email)
            || administrateurRepository.existsByEmail(email);
    }

    // ── CREER ──────────────────────────────────────────────
    public Object createUser(UpdateUserRequestDTO dto, String userType) {
        if (emailDejaUtilise(dto.getEmail()))
            throw new IllegalArgumentException("Email déjà utilisé");

        String motDePasseBrut = dto.getNom().substring(0, Math.min(3, dto.getNom().length())).toLowerCase() + "2000";
        String motDePasse = passwordEncoder.encode(motDePasseBrut);

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
                personnel.setType(role);
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
                Administrateur admin = new Administrateur();
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

    public Object createAdmin(UpdateUserRequestDTO dto) {
        return createUser(dto, "ADMIN");
    }

    // ── LIRE ───────────────────────────────────────────────
    public List<?> getAllUsers() {
        List<Object> all = new ArrayList<>();
        all.addAll(clientRepository.findAll().stream()
                .map(this::convertClientToDTO).collect(Collectors.toList()));
        all.addAll(personnelRepository.findAll().stream()
                .map(this::convertPersonnelToDTO).collect(Collectors.toList()));
        all.addAll(receptionnisteRepository.findAll().stream()
                .map(this::convertReceptionnisteToDTO).collect(Collectors.toList()));
        all.addAll(administrateurRepository.findAll().stream()
                .map(this::convertAdminToDTO).collect(Collectors.toList()));
        return all;
    }

    public List<?> getUsersByType(String type) {
        switch (type.toUpperCase()) {
            case "CLIENT":
                return clientRepository.findAll().stream()
                        .map(this::convertClientToDTO).collect(Collectors.toList());
            case "PERSONNEL":
                return personnelRepository.findAll().stream()
                        .map(this::convertPersonnelToDTO).collect(Collectors.toList());
            case "RECEPTIONNISTE":
                return receptionnisteRepository.findAll().stream()
                        .map(this::convertReceptionnisteToDTO).collect(Collectors.toList());
            case "ADMIN":
                return administrateurRepository.findAll().stream()
                        .map(this::convertAdminToDTO).collect(Collectors.toList());
            default:
                return new ArrayList<>();
        }
    }

    // ── MODIFIER ───────────────────────────────────────────
    public Object updateUser(Integer id, UpdateUserRequestDTO dto) {
        Optional<Client> client = clientRepository.findById(id);
        if (client.isPresent()) {
            Client u = client.get();
            u.setNom(dto.getNom());
            u.setPrenom(dto.getPrenom());
            u.setEmail(dto.getEmail());
            u.setTelephone(dto.getTelephone());
            return convertClientToDTO(clientRepository.save(u));
        }

        Optional<Personnel> personnel = personnelRepository.findById(id);
        if (personnel.isPresent()) {
            Personnel u = personnel.get();
            u.setNom(dto.getNom());
            u.setPrenom(dto.getPrenom());
            u.setEmail(dto.getEmail());
            u.setTelephone(dto.getTelephone());
            return convertPersonnelToDTO(personnelRepository.save(u));
        }

        Optional<Receptionniste> rec = receptionnisteRepository.findById(id);
        if (rec.isPresent()) {
            Receptionniste u = rec.get();
            u.setNom(dto.getNom());
            u.setPrenom(dto.getPrenom());
            u.setEmail(dto.getEmail());
            u.setTelephone(dto.getTelephone());
            return convertReceptionnisteToDTO(receptionnisteRepository.save(u));
        }

        Optional<Administrateur> admin = administrateurRepository.findById(id);
        if (admin.isPresent()) {
            Administrateur u = admin.get();
            u.setNom(dto.getNom());
            u.setPrenom(dto.getPrenom());
            u.setEmail(dto.getEmail());
            u.setTelephone(dto.getTelephone());
            return convertAdminToDTO(administrateurRepository.save(u));
        }

        throw new IllegalArgumentException("Utilisateur non trouvé: " + id);
    }

    // ── SUPPRIMER ──────────────────────────────────────────
    public void deleteUser(Integer id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id); return;
        }
        if (personnelRepository.existsById(id)) {
            personnelRepository.deleteById(id); return;
        }
        if (receptionnisteRepository.existsById(id)) {
            receptionnisteRepository.deleteById(id); return;
        }
        if (administrateurRepository.existsById(id)) {
            administrateurRepository.deleteById(id); return;
        }
        throw new IllegalArgumentException("Utilisateur non trouvé: " + id);
    }

    // ── CONVERTISSEURS ─────────────────────────────────────
    private ClientDTO convertClientToDTO(Client c) {
        return ClientDTO.builder()
                .id(c.getIdUtilisateur())
                .nom(c.getNom())
                .prenom(c.getPrenom())
                .email(c.getEmail())
                .telephone(c.getTelephone())
                .userType("CLIENT")
                .build();
    }

    private PersonnelDTO convertPersonnelToDTO(Personnel p) {
        return PersonnelDTO.builder()
                .id(p.getIdUtilisateur())
                .nom(p.getNom())
                .prenom(p.getPrenom())
                .email(p.getEmail())
                .telephone(p.getTelephone())
                .roleAffectation(p.getType())
                .userType("PERSONNEL")
                .build();
    }

    private ReceptionnisteDTO convertReceptionnisteToDTO(Receptionniste r) {
        return ReceptionnisteDTO.builder()
                .id(r.getIdUtilisateur())
                .nom(r.getNom())
                .prenom(r.getPrenom())
                .email(r.getEmail())
                .telephone(r.getTelephone())
                .userType("RECEPTIONNISTE")
                .build();
    }

    private AdminDTO convertAdminToDTO(Administrateur a) {
        return AdminDTO.builder()
                .id(a.getIdUtilisateur())
                .nom(a.getNom())
                .prenom(a.getPrenom())
                .email(a.getEmail())
                .telephone(a.getTelephone())
                .userType("ADMIN")
                .build();
    }
}