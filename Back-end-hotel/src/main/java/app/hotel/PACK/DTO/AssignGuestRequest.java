package app.hotel.PACK.DTO;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignGuestRequest {

    @NotBlank(message = "Le nom du client est obligatoire")
    private String guestName;

    @Email(message = "Email invalide")
    private String guestEmail;

    private String guestPhone;

    @NotBlank(message = "La date d'arrivée est obligatoire")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Format: yyyy-MM-dd")
    private String guestCheckIn;

    @NotBlank(message = "La date de départ est obligatoire")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Format: yyyy-MM-dd")
    private String guestCheckOut;
}