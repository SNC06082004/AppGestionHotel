package app.hotel.PACK.DTO;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignGuestRequest {
    @NotNull
    private Integer clientId;      // ✅ ID du client sélectionné
    @NotNull
    private String checkIn;
    @NotNull
    private String checkOut;
}