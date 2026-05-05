package app.hotel.PACK.services;

import app.hotel.PACK.DTO.AuthResponseDTO;
import app.hotel.PACK.DTO.ClientDTO;
import app.hotel.PACK.entities.Administrateur;
import app.hotel.PACK.entities.Client;
import app.hotel.PACK.entities.Personnel;
import app.hotel.PACK.entities.Receptionniste;
import app.hotel.PACK.entities.Utilisateur;
import app.hotel.PACK.repository.AdministrateurRepository;
import app.hotel.PACK.repository.ClientRepository;
import app.hotel.PACK.repository.PersonnelRepository;
import app.hotel.PACK.repository.ReceptionnisteRepository;
import app.hotel.PACK.Util.JsonWebUtil; // ✅ Corriger le nom
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final ClientRepository clientRepository;
    private final AdministrateurRepository administrateurRepository;
    private final PersonnelRepository personnelRepository;
    private final ReceptionnisteRepository receptionnisteRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JsonWebUtil jsonWebUtil;

    public AuthResponseDTO login(String email, String password) {
        
        // ✅ 1. Chercher dans Administrateur
        Optional<Administrateur> admin = administrateurRepository.findByEmail(email);
        if (admin.isPresent()) {
            return authenticate(admin.get(), password, "ADMIN");
        }

        // ✅ 2. Chercher dans Receptionniste
        Optional<Receptionniste> recep = receptionnisteRepository.findByEmail(email);
        if (recep.isPresent()) {
            return authenticate(recep.get(), password, "RECEPTIONNISTE");
        }

        // ✅ 3. Chercher dans Personnel
        Optional<Personnel> personnel = personnelRepository.findByEmail(email);
        if (personnel.isPresent()) {
            return authenticate(personnel.get(), password, "PERSONNEL");
        }

        // ✅ 4. Chercher dans Client
        Optional<Client> client = clientRepository.findByEmail(email);
        if (client.isPresent()) {
            return authenticate(client.get(), password, "CLIENT");
        }

        throw new IllegalArgumentException("Email ou mot de passe incorrect");
    }

    // ✅ Méthode générique d'authentification
    private AuthResponseDTO authenticate(Utilisateur user, String password, String role) {
        if (!passwordEncoder.matches(password, user.getMotDePasse())) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect");
        }

        // ✅ Token avec le rôle inclus
        String token = jsonWebUtil.generateToken(
            user.getIdUtilisateur().toString(), 
            role
        );

        return AuthResponseDTO.builder()
                .token(token)
                .user(ClientDTO.builder()
                        .id(user.getIdUtilisateur())
                        .nom(user.getNom())
                        .prenom(user.getPrenom())
                        .email(user.getEmail())
                        .build())
                .build();
    }

    public AuthResponseDTO register(Client newClient) {
        if (clientRepository.existsByEmail(newClient.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }
        newClient.setMotDePasse(passwordEncoder.encode(newClient.getMotDePasse()));
        Client saved = clientRepository.save(newClient);

        String token = jsonWebUtil.generateToken(
            saved.getIdUtilisateur().toString(), 
            "CLIENT"  // ✅ Rôle explicite
        );

        return AuthResponseDTO.builder()
                .token(token)
                .user(ClientDTO.builder()
                        .id(saved.getIdUtilisateur())
                        .nom(saved.getNom())
                        .prenom(saved.getPrenom())
                        .email(saved.getEmail())
                        .build())
                .build();
    }
}