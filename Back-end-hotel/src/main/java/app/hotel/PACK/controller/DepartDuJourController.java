package app.hotel.PACK.controller;

import app.hotel.PACK.DTO.DepartDuJourDTO;
import app.hotel.PACK.services.DepartDuJourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/departs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DepartDuJourController {

    private final DepartDuJourService departDuJourService;

    @GetMapping("/jour")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<List<DepartDuJourDTO>> getDepartsDuJour() {
        return ResponseEntity.ok(departDuJourService.getDepartsDuJour());
    }

    @PatchMapping("/{reservationId}/effectue")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<DepartDuJourDTO> marquerDepartEffectue(
            @PathVariable Integer reservationId) {
        return ResponseEntity.ok(departDuJourService.marquerDepartEffectue(reservationId));
    }
}
