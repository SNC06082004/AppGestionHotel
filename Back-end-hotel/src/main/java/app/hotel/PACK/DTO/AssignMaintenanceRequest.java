package app.hotel.PACK.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignMaintenanceRequest {
    @NotNull
    private Integer personnelId;   // ✅ ID au lieu du nom
    private String notes;
}