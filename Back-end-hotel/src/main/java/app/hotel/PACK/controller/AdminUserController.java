package app.hotel.PACK.controller;


import app.hotel.PACK.DTO.UpdateUserRequestDTO;
import app.hotel.PACK.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AdminUserController {

    private final AdminUserService adminUserService;

    /**
     * Récupérer tous les utilisateurs
     */
    @GetMapping("/users")
    public ResponseEntity<List<?>> getAllUsers() {
        System.out.println("[AdminUserController] GET /api/admin/users");
        try {
            List<?> users = adminUserService.getAllUsers();
            System.out.println("[AdminUserController] ✅ " + users.size() + " utilisateurs trouvés");
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.err.println("[AdminUserController] ❌ Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Récupérer par type
     */
    @GetMapping("/users/type/{type}")
    public ResponseEntity<List<?>> getUsersByType(@PathVariable String type) {
        System.out.println("[AdminUserController] GET /api/admin/users/type/" + type);
        try {
            List<?> users = adminUserService.getUsersByType(type);
            System.out.println("[AdminUserController] ✅ " + users.size() + " " + type);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.err.println("[AdminUserController] ❌ Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Créer un utilisateur
     * Body doit inclure: userType (CLIENT, PERSONNEL, RECEPTIONNISTE, ADMIN)
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(
            @Valid @RequestBody UpdateUserRequestDTO userDTO,
            @RequestParam String userType) {
        System.out.println("[AdminUserController] POST /api/admin/users - Type: " + userType);
        try {
            Object user = adminUserService.createUser(userDTO, userType);
            System.out.println("[AdminUserController] ✅ Utilisateur créé");
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException e) {
            System.err.println("[AdminUserController] ❌ Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Erreur: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("[AdminUserController] ❌ Erreur: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Modifier un utilisateur
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequestDTO userDTO) {
        System.out.println("[AdminUserController] PUT /api/admin/users/" + id);
        try {
            Object user = adminUserService.updateUser(id, userDTO);
            System.out.println("[AdminUserController] ✅ Utilisateur modifié");
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            System.err.println("[AdminUserController] ❌ Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erreur: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("[AdminUserController] ❌ Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Supprimer un utilisateur
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        System.out.println("[AdminUserController] DELETE /api/admin/users/" + id);
        try {
            adminUserService.deleteUser(id);
            System.out.println("[AdminUserController] ✅ Utilisateur supprimé");
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            System.err.println("[AdminUserController] ❌ Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erreur: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("[AdminUserController] ❌ Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Créer un administrateur
     */
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@Valid @RequestBody UpdateUserRequestDTO adminDTO) {
        System.out.println("[AdminUserController] POST /api/admin/create-admin");
        try {
            Object admin = adminUserService.createAdmin(adminDTO);
            System.out.println("[AdminUserController] ✅ Admin créé");
            return ResponseEntity.status(HttpStatus.CREATED).body(admin);
        } catch (Exception e) {
            System.err.println("[AdminUserController] ❌ Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur: " + e.getMessage());
        }
    }
}

