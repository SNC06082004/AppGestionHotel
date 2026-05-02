package app.hotel.PACK.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignMaintenanceRequest {

    @NotBlank(message = "Le technicien est obligatoire")
    private String staff;

    private String notes;
}