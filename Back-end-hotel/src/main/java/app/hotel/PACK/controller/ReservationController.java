package app.hotel.PACK.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.hotel.PACK.DTO.DisponibiliteDTO;
import app.hotel.PACK.DTO.ReservationRequestDTO;
import app.hotel.PACK.services.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping("/fourchette-prix/{type}")
    public ResponseEntity<Map<String, Double>> getFourchettePrix(@PathVariable String type) {
        return ResponseEntity.ok(reservationService.getFourchettePrix(type));
    }

    @GetMapping("/check-disponibilite")
    public ResponseEntity<DisponibiliteDTO> checkDispo(
            @RequestParam String type,
            @RequestParam Integer capacite,
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        log.info("🔍 Check dispo: {} cap:{} {} → {}", type, capacite, checkIn, checkOut);
        return ResponseEntity.ok(
            reservationService.checkDisponibilite(type, capacite, checkIn, checkOut));
    }

    @PostMapping("/creer")
    public ResponseEntity<?> creerReservation(@RequestBody ReservationRequestDTO dto) {
        log.info("📅 Création réservation client:{} type:{}", dto.getClientId(), dto.getType());
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.creerReservation(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
