package app.hotel.PACK.controller;

import app.hotel.PACK.DTO.ComplaintDTO;
import app.hotel.PACK.services.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintDTO> createComplaint(@Valid @RequestBody ComplaintDTO complaintDTO) {
        try {
            ComplaintDTO created = complaintService.createComplaint(complaintDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints() {
        List<ComplaintDTO> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintDTO> getComplaintById(@PathVariable Integer id) {
        Optional<ComplaintDTO> complaint = complaintService.getComplaintById(id);
        return complaint.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByClient(@PathVariable Integer clientId) {
        List<ComplaintDTO> complaints = complaintService.getComplaintsByClientId(clientId);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByType(@PathVariable String type) {
        List<ComplaintDTO> complaints = complaintService.getComplaintsByType(type);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/client/{clientId}/type/{type}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByClientAndType(
            @PathVariable Integer clientId,
            @PathVariable String type) {
        List<ComplaintDTO> complaints = complaintService.getComplaintsByClientIdAndType(clientId, type);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByStatus(@PathVariable String status) {
        List<ComplaintDTO> complaints = complaintService.getComplaintsByStatus(status);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByPriority(@PathVariable String priority) {
        List<ComplaintDTO> complaints = complaintService.getComplaintsByPriority(priority);
        return ResponseEntity.ok(complaints);
    }

    /**
     * Mettre à jour une plainte ou demande
     */
    @PutMapping("/{id}")
    public ResponseEntity<ComplaintDTO> updateComplaint(
            @PathVariable Integer id,  // ✅ CORRIGÉ: Integer au lieu de String
            @Valid @RequestBody ComplaintDTO complaintDTO) {
        try {
            ComplaintDTO updated = complaintService.updateComplaint(id, complaintDTO);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Changer le statut d'une plainte/demande
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ComplaintDTO> updateStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        try {
            ComplaintDTO updated = complaintService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Supprimer une plainte/demande
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Integer id) {
        try {
            complaintService.deleteComplaint(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}