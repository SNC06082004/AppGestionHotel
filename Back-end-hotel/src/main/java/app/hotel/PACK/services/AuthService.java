package app.hotel.PACK.services;

import app.hotel.PACK.DTO.AuthResponseDTO;
import app.hotel.PACK.DTO.ClientDTO;
import app.hotel.PACK.entities.Client;
import app.hotel.PACK.repository.ClientRepository;
import app.hotel.PACK.Util.JsonWebUtil; // ✅ Corriger le nom
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final ClientRepository clientRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JsonWebUtil jsonWebUtil; // ✅ Corriger le nom (JsonWebUtil au lieu de jwtUtil)

    public AuthResponseDTO login(String email, String password) {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(password, client.getMotDePasse())) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect");
        }

        String token = jsonWebUtil.generateToken(client.getIdUtilisateur().toString());
        
        return AuthResponseDTO.builder()
                .token(token)
                .user(ClientDTO.builder() // ✅ Utiliser ClientDTO au lieu de ClientResponseDTO
                        .id(client.getIdUtilisateur())
                        .nom(client.getNom())
                        .prenom(client.getPrenom())
                        .email(client.getEmail())
                        .build())
                .build();
    }

    public AuthResponseDTO register(Client newClient) {
        if (clientRepository.existsByEmail(newClient.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }

        // Hasher le mot de passe
        newClient.setMotDePasse(passwordEncoder.encode(newClient.getMotDePasse()));
        
        Client savedClient = clientRepository.save(newClient);
        String token = jsonWebUtil.generateToken(savedClient.getIdUtilisateur().toString());

        return AuthResponseDTO.builder()
                .token(token)
                .user(ClientDTO.builder() // ✅ Utiliser ClientDTO au lieu de ClientResponseDTO
                        .id(savedClient.getIdUtilisateur())
                        .nom(savedClient.getNom())
                        .prenom(savedClient.getPrenom())
                        .email(savedClient.getEmail())
                        .build())
                .build();
    }
}