package app.hotel.PACK.controller;


import app.hotel.PACK.repository.ClientRepository;
import app.hotel.PACK.DTO.ClientDTO;
import app.hotel.PACK.entities.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    private final ClientRepository clientRepository;

    /**
     * Récupérer tous les clients
     */
 
    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
    	
        List<ClientDTO> clients = clientRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clients);
        
    }

    private ClientDTO convertToDTO(Client client) {
        return ClientDTO.builder()
                .id(client.getIdUtilisateur())
                .nom(client.getNom())           // ✅ Utiliser 'nom'
                .prenom(client.getPrenom())     // ✅ Utiliser 'prenom'
                .email(client.getEmail())
                .telephone(client.getTelephone())
                .build();
    }
}

