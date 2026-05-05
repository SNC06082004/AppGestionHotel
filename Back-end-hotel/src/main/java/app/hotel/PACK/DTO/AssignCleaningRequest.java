package app.hotel.PACK.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignCleaningRequest {

    @NotNull(message = "Le personnel est obligatoire")
    private Integer personnelId; 
}
