package app.hotel.PACK.services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;  // ✅
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;      // ✅
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.hotel.PACK.DTO.ChambreSelectDTO;      // ✅
import app.hotel.PACK.DTO.DisponibiliteDTO;
import app.hotel.PACK.DTO.ReservationRequestDTO;
import app.hotel.PACK.DTO.ReservationResponseDTO;
import app.hotel.PACK.entities.Chambre;
import app.hotel.PACK.entities.Client;
import app.hotel.PACK.entities.Reservation;
import app.hotel.PACK.entities.enums.RoomStatut;
import app.hotel.PACK.entities.enums.RoomType;
import app.hotel.PACK.repository.ChambreRepository;
import app.hotel.PACK.repository.ClientRepository;
import app.hotel.PACK.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;

// ... reste du code identique
import lombok.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

    private final ChambreRepository chambreRepository;
    private final ReservationRepository reservationRepository;
    private final ClientRepository clientRepository;

    // ── CHECK DISPONIBILITÉ ──────────────────────────────────
    @Transactional(readOnly = true)
    public DisponibiliteDTO checkDisponibilite(
            String type, Integer capacite, String checkInStr, String checkOutStr) {

        RoomType roomType = RoomType.valueOf(type.toUpperCase());
        LocalDate checkIn  = LocalDate.parse(checkInStr);
        LocalDate checkOut = LocalDate.parse(checkOutStr);

        // Toutes les chambres de ce type
        List<Chambre> toutesChambres = chambreRepository.findByType(roomType);

        // Chambres occupées sur cette période
        List<Chambre> occupees = reservationRepository
            .findChambresOccupeesParTypeSurPeriode(roomType, checkIn, checkOut);
        Set<Integer> occupeesIds = occupees.stream()
            .map(Chambre::getIdChambre).collect(Collectors.toSet());

        // Chambres libres avec capacité suffisante
        List<Chambre> disponibles = toutesChambres.stream()
            .filter(c -> !occupeesIds.contains(c.getIdChambre()))
            .filter(c -> c.getStatut() == RoomStatut.DISPONIBLE)
            .filter(c -> c.getCapacity() >= capacite)
            .collect(Collectors.toList());

        if (!disponibles.isEmpty()) {
            long nuits = ChronoUnit.DAYS.between(checkIn, checkOut);
            return DisponibiliteDTO.builder()
                .disponible(true)
                .chambresDisponibles(disponibles.stream()
                    .map(c -> ChambreSelectDTO.builder()
                        .id(c.getIdChambre())
                        .number(c.getNumber())
                        .capacity(c.getCapacity().intValue())
                        .price(c.getPrice())
                        .floor(c.getFloor().intValue())
                        .build())
                    .collect(Collectors.toList()))
                .message("Chambres disponibles trouvées")
                .build();
        }

        // Aucune chambre avec cette capacité → chercher capacités alternatives
        List<Integer> alternatives = toutesChambres.stream()
            .filter(c -> !occupeesIds.contains(c.getIdChambre()))
            .filter(c -> c.getStatut() == RoomStatut.DISPONIBLE)
            .map(c -> c.getCapacity().intValue())
            .distinct().sorted()
            .collect(Collectors.toList());

        return DisponibiliteDTO.builder()
            .disponible(false)
            .capacitesAlternatives(alternatives)
            .message(alternatives.isEmpty()
                ? "Aucune chambre de type " + type + " disponible sur cette période."
                : "Aucune chambre pour " + capacite + " personnes. Capacités disponibles : " +
                  alternatives.stream().map(String::valueOf).collect(Collectors.joining(", ")))
            .build();
    }

    // ── CRÉER RÉSERVATION ────────────────────────────────────
    public ReservationResponseDTO creerReservation(ReservationRequestDTO dto) {
        RoomType roomType = RoomType.valueOf(dto.getType().toUpperCase());
        LocalDate checkIn  = LocalDate.parse(dto.getCheckIn());
        LocalDate checkOut = LocalDate.parse(dto.getCheckOut());

        Client client = clientRepository.findById(dto.getClientId())
            .orElseThrow(() -> new IllegalArgumentException("Client non trouvé"));

        // Chambres disponibles
        List<Chambre> occupees = reservationRepository
            .findChambresOccupeesParTypeSurPeriode(roomType, checkIn, checkOut);
        Set<Integer> occupeesIds = occupees.stream()
            .map(Chambre::getIdChambre).collect(Collectors.toSet());

        List<Chambre> disponibles = chambreRepository.findByType(roomType).stream()
            .filter(c -> !occupeesIds.contains(c.getIdChambre()))
            .filter(c -> c.getStatut() == RoomStatut.DISPONIBLE)
            .filter(c -> c.getCapacity() >= dto.getCapacite())
            .collect(Collectors.toList());

        if (disponibles.isEmpty())
            throw new IllegalArgumentException("Plus de chambre disponible");

        // Sélection aléatoire
        Chambre chambre = disponibles.get(new Random().nextInt(disponibles.size()));

        // Créer la réservation
        Reservation reservation = new Reservation();
        reservation.setClient(client);
        reservation.setCheckIn(checkIn);
        reservation.setCheckOut(checkOut);
        reservation.setAdultes(dto.getAdultes());
        reservation.setEnfants(dto.getEnfants() != null ? dto.getEnfants() : 0.0);
        reservation.setChambreNb(dto.getChambresNb() != null ? dto.getChambresNb().doubleValue() : 1.0);
        reservation.setAvecAnimal(dto.getAvecAnimal() != null && dto.getAvecAnimal());
        reservation.setChambres(List.of(chambre));
        reservationRepository.save(reservation);

        // Mettre la chambre en OCCUPEE
        chambre.setStatut(RoomStatut.OCCUPEE);
        chambre.setStaff(client.getPrenom() + " " + client.getNom());
        chambre.setNotes("Check-in: " + checkIn + " | Check-out: " + checkOut);
        chambreRepository.save(chambre);

        long nuits = ChronoUnit.DAYS.between(checkIn, checkOut);
        String ref = "LXR-" + reservation.getIdReservation() + "-" +
                     LocalDate.now().getYear();

        return ReservationResponseDTO.builder()
            .idReservation(reservation.getIdReservation())
            .reference(ref)
            .nomClient(client.getPrenom() + " " + client.getNom())
            .emailClient(client.getEmail())
            .typeChambre(chambre.getType().name())
            .numeroChambre(chambre.getNumber())
            .etage(chambre.getFloor().intValue())
            .prix(chambre.getPrice())
            .prixTotal(chambre.getPrice() * nuits)
            .checkIn(checkIn.toString())
            .checkOut(checkOut.toString())
            .nuits((int) nuits)
            .adultes(dto.getAdultes())
            .enfants(dto.getEnfants() != null ? dto.getEnfants() : 0.0)
            .build();
    }

    // ── FOURCHETTE DE PRIX PAR TYPE ──────────────────────────
    @Transactional(readOnly = true)
    public Map<String, Double> getFourchettePrix(String type) {
        List<Chambre> chambres = chambreRepository.findByType(RoomType.valueOf(type.toUpperCase()));
        if (chambres.isEmpty()) return Map.of("min", 0.0, "max", 0.0);
        double min = chambres.stream().mapToDouble(Chambre::getPrice).min().orElse(0);
        double max = chambres.stream().mapToDouble(Chambre::getPrice).max().orElse(0);
        return Map.of("min", min, "max", max);
    }
}