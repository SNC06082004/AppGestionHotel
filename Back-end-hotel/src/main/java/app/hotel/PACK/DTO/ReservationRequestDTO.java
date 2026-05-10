package app.hotel.PACK.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.*;
//ReservationRequestDTO.java — corps de la requête de création
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ReservationRequestDTO {
 @NotNull private Integer clientId;
 @NotNull private String type;         // RoomType
 @NotNull private Integer capacite;
 @NotNull private String checkIn;
 @NotNull private String checkOut;
 @NotNull private Double adultes;
 private Double enfants;
 private Integer chambresNb;
 private Boolean avecAnimal;
}
