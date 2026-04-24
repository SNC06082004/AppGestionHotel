package app.hotel.PACK.services;

import app.hotel.PACK.DTO.InscriptionRequestDTO;
import app.hotel.PACK.DTO.InscriptionResponseDTO;
import app.hotel.PACK.entities.Client;
import app.hotel.PACK.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public InscriptionResponseDTO inscrireClient(InscriptionRequestDTO dto) {

        if (clientRepository.existsByEmail(dto.getEmail())) {
            return new InscriptionResponseDTO(
                false,
                "Cet email est deja associe a un compte",
                null
            );
        }

        Client client = new Client();
        client.setNom(dto.getNom());
        client.setPrenom(dto.getPrenom());
        client.setEmail(dto.getEmail());
        client.setTelephone(dto.getTelephone());
        client.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));

        Client saved = clientRepository.save(client);

        return new InscriptionResponseDTO(
            true,
            "Inscription reussie",
            saved.getIdUtilisateur()
        );
    }
}