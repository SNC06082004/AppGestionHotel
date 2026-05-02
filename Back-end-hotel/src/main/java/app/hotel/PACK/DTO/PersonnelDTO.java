package app.hotel.PACK.DTO;

import app.hotel.PACK.entities.enums.RoleAffectation;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonnelDTO {
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private Integer idPersonnel;
    private String userType;
    private RoleAffectation type;
}