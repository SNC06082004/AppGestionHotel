package app.hotel.PACK.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceptionnisteDTO {
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private Integer idReception;
    private Integer type;
    private String userType;
}