package app.hotel.PACK.DTO;

import app.hotel.PACK.entities.enums.RoomStatut;
import app.hotel.PACK.entities.enums.RoomType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChambreDTO {

    private Integer id;
    private String number;
    private Integer floor;
    private RoomType type;
    private RoomStatut status;   // ← "status" pas "statut" pour matcher le front Angular
    private Integer capacity;
    private Double price;
    private String staff;
    private String notes;
    private String createdAt;
    private String updatedAt;
}