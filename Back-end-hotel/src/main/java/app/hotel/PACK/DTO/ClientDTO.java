package app.hotel.PACK.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDTO {
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
}