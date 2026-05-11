package app.hotel.PACK.controller;

import app.hotel.PACK.DTO.ClientDTO;
import app.hotel.PACK.entities.Client;
import app.hotel.PACK.entities.Chambre;
import app.hotel.PACK.entities.Reservation;
import app.hotel.PACK.repository.ClientRepository;
import app.hotel.PACK.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    private final ClientRepository clientRepository;
    private final ReservationRepository reservationRepository;

    /** GET /api/clients — tous les clients avec leur chambre active */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        LocalDate today = LocalDate.now();

        List<ClientDTO> clients = clientRepository.findAll()
                .stream()
                .map(client -> convertToDTO(client, today))
                .collect(Collectors.toList());

        return ResponseEntity.ok(clients);
    }

    // ── Conversion ────────────────────────────────────────────────

    private ClientDTO convertToDTO(Client client, LocalDate today) {
        ClientDTO.ClientDTOBuilder builder = ClientDTO.builder()
                .id(client.getIdUtilisateur())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .email(client.getEmail())
                .telephone(client.getTelephone())
                .nombreSejours(
                    client.getReservations() != null
                        ? client.getReservations().size()
                        : 0
                );

        // Chercher la réservation active
        List<Reservation> actives = reservationRepository
                .findReservationsActives(client.getIdUtilisateur(), today);

        if (!actives.isEmpty()) {
            Reservation active = actives.get(0);

            // Numéro de la première chambre
            String numeroChambre = active.getChambres() != null && !active.getChambres().isEmpty()
                    ? active.getChambres().get(0).getNumber()
                    : "—";

            builder
                .chambreActive(numeroChambre)
                .checkIn(active.getCheckIn() != null  ? active.getCheckIn().toString()  : null)
                .checkOut(active.getCheckOut() != null ? active.getCheckOut().toString() : null);
        }

        return builder.build();
    }
}