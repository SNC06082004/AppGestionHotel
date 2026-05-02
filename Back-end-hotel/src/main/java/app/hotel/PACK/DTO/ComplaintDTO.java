package app.hotel.PACK.DTO;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintDTO {

    private Integer id;

    @NotNull(message = "Le clientId est obligatoire")
    private Integer clientId;

    private String clientName;

    @NotBlank(message = "Le type est obligatoire")
    private String type; // 'complaint' ou 'special-request'

    // Pour les plaintes
    private String priority; // Normale, Haute, Urgente

    // Pour les demandes spéciales
    private String preferenceType; // Préférence alimentaire, etc.

    // Pour les plaintes
    private String subject;

    @NotBlank(message = "Les détails sont obligatoires")
    @Size(min = 10, message = "Les détails doivent contenir au moins 10 caractères")
    private String details;

    // Pour les demandes spéciales (format dd/mm/yyyy)
    private String requestedDate;

    @NotBlank(message = "Le statut est obligatoire")
    private String status; // En attente, En cours, Résolue

    private String createdAt;
    private String updatedAt;
}