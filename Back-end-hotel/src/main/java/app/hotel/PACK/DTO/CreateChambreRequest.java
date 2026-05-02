package app.hotel.PACK.DTO;

import app.hotel.PACK.entities.enums.RoomType;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateChambreRequest {

    @NotBlank(message = "Le numéro de chambre est obligatoire")
    private String number;

    @NotNull(message = "L'étage est obligatoire")
    @Min(value = 0, message = "L'étage doit être >= 0")
    private Integer floor;

    @NotNull(message = "Le type est obligatoire")
    private RoomType type;

    @NotNull(message = "La capacité est obligatoire")
    @Min(value = 1, message = "La capacité doit être >= 1")
    @Max(value = 20, message = "La capacité doit être <= 20")
    private Integer capacity;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix doit être > 0")
    private Double price;

    private String staff;

    @Size(max = 500, message = "Les notes ne doivent pas dépasser 500 caractères")
    private String notes;
}
