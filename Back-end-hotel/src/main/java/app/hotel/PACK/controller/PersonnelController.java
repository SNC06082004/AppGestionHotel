package app.hotel.PACK.controller;

import app.hotel.PACK.DTO.PersonnelDTO;
import app.hotel.PACK.entities.enums.RoleAffectation;
import app.hotel.PACK.services.PersonnelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/personnel")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class PersonnelController {

    private final PersonnelService personnelService;

    @GetMapping
    public ResponseEntity<List<PersonnelDTO>> getAllPersonnel() {
        log.info("📋 GET /api/personnel");
        return ResponseEntity.ok(personnelService.getAllPersonnel());
    }

    @GetMapping("/by-type/{type}")
    public ResponseEntity<List<PersonnelDTO>> getByType(@PathVariable String type) {
        log.info("🔍 GET /api/personnel/by-type/{}", type);
        try {
            RoleAffectation roleType = RoleAffectation.valueOf(type);
            return ResponseEntity.ok(personnelService.getByType(roleType));
        } catch (IllegalArgumentException e) {
            log.error("❌ Type invalide: {}", type);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/cleaning")
    public ResponseEntity<List<PersonnelDTO>> getCleaningStaff() {
        log.info("🧹 GET /api/personnel/cleaning");
        return ResponseEntity.ok(personnelService.getCleaningStaff());
    }

    @GetMapping("/maintenance")
    public ResponseEntity<List<PersonnelDTO>> getMaintenanceStaff() {
        log.info("🔧 GET /api/personnel/maintenance");
        return ResponseEntity.ok(personnelService.getMaintenanceStaff());
    }
}

