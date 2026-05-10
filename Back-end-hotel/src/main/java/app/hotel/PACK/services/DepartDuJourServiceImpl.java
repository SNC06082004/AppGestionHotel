package app.hotel.PACK.services;

import app.hotel.PACK.DTO.DepartDuJourDTO;
import app.hotel.PACK.entities.Chambre;
import app.hotel.PACK.entities.Reservation;
import app.hotel.PACK.entities.enums.RoomStatut;
import app.hotel.PACK.repository.ChambreRepository;
import app.hotel.PACK.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartDuJourServiceImpl implements DepartDuJourService {

    private final ReservationRepository reservationRepository;
    private final ChambreRepository chambreRepository;
    private final CarteFideliteService carteFideliteService;

    @Override
    @Transactional(readOnly = true)
    public List<DepartDuJourDTO> getDepartsDuJour() {
        LocalDate aujourd_hui = LocalDate.now();

        return reservationRepository.findByCheckOut(aujourd_hui)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DepartDuJourDTO marquerDepartEffectue(Integer reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Réservation non trouvée avec l'ID: " + reservationId));

        // Passer toutes les chambres de la réservation en EN_NETTOYAGE
        for (Chambre chambre : reservation.getChambres()) {
            chambre.setStatut(RoomStatut.EN_NETTOYAGE);
            chambreRepository.save(chambre);
        }

        // Enregistrer le séjour complété sur la carte fidélité du client
        // (crée la carte si elle n'existe pas encore)
        carteFideliteService.enregistrerSejour(
                reservation.getClient().getIdUtilisateur());

        return convertToDTO(reservation);
    }

    // ── Helper ────────────────────────────────────────────────────

    private DepartDuJourDTO convertToDTO(Reservation r) {
        // On prend la première chambre (la réservation peut en avoir plusieurs)
        Chambre chambre = r.getChambres() != null && !r.getChambres().isEmpty()
                ? r.getChambres().get(0) : null;

        boolean departEffectue = chambre != null
                && (chambre.getStatut() == RoomStatut.EN_NETTOYAGE
                || chambre.getStatut() == RoomStatut.DISPONIBLE);

        return DepartDuJourDTO.builder()
                .reservationId(r.getIdReservation())
                .clientId(r.getClient().getIdUtilisateur())
                .clientNom(r.getClient().getPrenom() + " " + r.getClient().getNom())
                .clientTelephone(r.getClient().getTelephone())
                .clientEmail(r.getClient().getEmail())
                .numeroChambre(chambre != null ? chambre.getNumber() : "—")
                .typeChambre(chambre != null ? chambre.getType().name() : "—")
                .statutChambre(chambre != null ? chambre.getStatut().name() : "—")
                .checkIn(r.getCheckIn() != null ? r.getCheckIn().toString() : "—")
                .checkOut(r.getCheckOut() != null ? r.getCheckOut().toString() : "—")
                .departEffectue(departEffectue)
                .build();
    }
}