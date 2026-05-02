package app.hotel.PACK.controller;

import app.hotel.PACK.DTO.*;
import app.hotel.PACK.services.ChambreService;
import app.hotel.PACK.entities.enums.RoomType;
import app.hotel.PACK.entities.enums.RoomStatut;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/chambres")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class ChambreController {

    private final ChambreService chambreService;

    // ────── CRUD BASIQUE ──────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE', 'MANAGER')")
    public ResponseEntity<List<ChambreDTO>> getAllChambres() {
        log.info("📋 GET /api/chambres");
        List<ChambreDTO> chambres = chambreService.getAllChambres();
        return ResponseEntity.ok(chambres);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE', 'MANAGER', 'TECHNICIEN', 'FEMME_DE_CHAMBRE')")
    public ResponseEntity<ChambreDTO> getChambreById(@PathVariable Integer id) {
        log.info("🔍 GET /api/chambres/{}", id);
        return chambreService.getChambreById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECEPTIONNISTE')")
    public ResponseEntity<ChambreDTO> createChambre(@Valid @RequestBody CreateChambreRequest request) {
        try {
            log.info("➕ POST /api/chambres - Création chambre {}", request.getNumber());
            ChambreDTO created = chambreService.createChambre(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erreur création: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECEPTIONNISTE')")
    public ResponseEntity<ChambreDTO> updateChambre(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateChambreRequest request) {
        try {
            log.info("✏️ PUT /api/chambres/{}", id);
            ChambreDTO updated = chambreService.updateChambre(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erreur mise à jour: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteChambre(@PathVariable Integer id) {
        try {
            log.info("🗑️ DELETE /api/chambres/{}", id);
            chambreService.deleteChambre(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("❌ Erreur suppression: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // ────── FILTRAGE ──────

    @GetMapping("/by-status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE', 'MANAGER')")
    public ResponseEntity<List<ChambreDTO>> getByStatus(@PathVariable String status) {
        log.info("🔍 GET /api/chambres/by-status/{}", status);
        try {
            RoomStatut roomStatus = RoomStatut.valueOf(status);
            List<ChambreDTO> chambres = chambreService.getChambresByStatus(roomStatus);
            return ResponseEntity.ok(chambres);
        } catch (IllegalArgumentException e) {
            log.error("❌ Statut invalide: {}", status);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/by-type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE', 'MANAGER')")
    public ResponseEntity<List<ChambreDTO>> getByType(@PathVariable String type) {
        log.info("🔍 GET /api/chambres/by-type/{}", type);
        try {
            RoomType roomType = RoomType.valueOf(type);
            List<ChambreDTO> chambres = chambreService.getChambresByType(roomType);
            return ResponseEntity.ok(chambres);
        } catch (IllegalArgumentException e) {
            log.error("❌ Type invalide: {}", type);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/by-floor/{floor}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE', 'MANAGER')")
    public ResponseEntity<List<ChambreDTO>> getByFloor(@PathVariable Integer floor) {
        log.info("🔍 GET /api/chambres/by-floor/{}", floor);
        List<ChambreDTO> chambres = chambreService.getChambresByFloor(floor);
        return ResponseEntity.ok(chambres);
    }

    // ────── GESTION DE STATUTS ──────

    @PatchMapping("/{id}/assign-cleaning")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECEPTIONNISTE')")
    public ResponseEntity<ChambreDTO> assignCleaning(
            @PathVariable Integer id,
            @Valid @RequestBody AssignCleaningRequest request) {
        try {
            log.info("🧹 PATCH /api/chambres/{}/assign-cleaning", id);
            ChambreDTO result = chambreService.assignCleaning(id, request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erreur: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/{id}/assign-maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECEPTIONNISTE')")
    public ResponseEntity<ChambreDTO> assignMaintenance(
            @PathVariable Integer id,
            @Valid @RequestBody AssignMaintenanceRequest request) {
        try {
            log.info("🔧 PATCH /api/chambres/{}/assign-maintenance", id);
            ChambreDTO result = chambreService.assignMaintenance(id, request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erreur: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/{id}/assign-guest")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<ChambreDTO> assignGuest(
            @PathVariable Integer id,
            @Valid @RequestBody AssignGuestRequest request) {
        try {
            log.info("🔑 PATCH /api/chambres/{}/assign-guest", id);
            ChambreDTO result = chambreService.assignGuest(id, request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erreur: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/{id}/checkout")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<ChambreDTO> checkout(@PathVariable Integer id) {
        try {
            log.info("✅ PATCH /api/chambres/{}/checkout", id);
            ChambreDTO result = chambreService.checkout(id);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erreur: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/{id}/mark-available")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE', 'MANAGER')")
    public ResponseEntity<ChambreDTO> markAvailable(@PathVariable Integer id) {
        try {
            log.info("🟢 PATCH /api/chambres/{}/mark-available", id);
            ChambreDTO result = chambreService.markAvailable(id);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erreur: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}