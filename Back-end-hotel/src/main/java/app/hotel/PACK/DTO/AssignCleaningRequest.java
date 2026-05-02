package app.hotel.PACK.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignCleaningRequest {

    @NotBlank(message = "Le personnel est obligatoire")
    private String staff;
}
