package app.hotel.PACK.controller;

import app.hotel.PACK.DTO.CarteFideliteDTO;
import app.hotel.PACK.services.CarteFideliteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fidelite")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CarteFideliteController {

    private final CarteFideliteService carteFideliteService;

    /** GET /api/fidelite — toutes les cartes (triées par points décroissants) */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<List<CarteFideliteDTO>> getAllCartes() {
        return ResponseEntity.ok(carteFideliteService.getAllCartes());
    }

    /** GET /api/fidelite/client/{clientId} — carte d'un client (ou 404) */
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<CarteFideliteDTO> getCarteByClient(@PathVariable Integer clientId) {
        return carteFideliteService.getCarteByClientId(clientId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /** POST /api/fidelite/client/{clientId} — créer une carte pour un client */
    @PostMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<CarteFideliteDTO> creerCarte(@PathVariable Integer clientId) {
        try {
            CarteFideliteDTO carte = carteFideliteService.creerCarte(clientId);
            return ResponseEntity.status(HttpStatus.CREATED).body(carte);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalStateException e) {
            // Carte déjà existante
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    /**
     * POST /api/fidelite/client/{clientId}/points
     * Body: { "points": 100 }
     */
    @PostMapping("/client/{clientId}/points")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<CarteFideliteDTO> ajouterPoints(
            @PathVariable Integer clientId,
            @RequestBody Map<String, Double> body) {
        try {
            Double points = body.get("points");
            if (points == null || points <= 0) {
                return ResponseEntity.badRequest().build();
            }
            CarteFideliteDTO updated = carteFideliteService.ajouterPoints(clientId, points);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * GET /api/fidelite/client/{clientId}/ou-creer
     * Retourne la carte existante ou en crée une nouvelle
     */
    @GetMapping("/client/{clientId}/ou-creer")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONNISTE')")
    public ResponseEntity<CarteFideliteDTO> getOuCreerCarte(@PathVariable Integer clientId) {
        try {
            return ResponseEntity.ok(carteFideliteService.getOuCreerCarte(clientId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

