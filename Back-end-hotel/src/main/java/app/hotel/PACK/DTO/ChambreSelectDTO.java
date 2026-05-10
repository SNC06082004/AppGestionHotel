package app.hotel.PACK.DTO;
import lombok.*;
//ChambreSelectDTO.java — info minimale d'une chambre disponible
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ChambreSelectDTO {
 private Integer id;
 private String number;
 private Integer capacity;
 private Double price;
 private Integer floor;
}