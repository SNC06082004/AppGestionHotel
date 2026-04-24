package app.hotel.PACK.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InscriptionResponseDTO {

    private boolean succes;
    private String message;
    private Integer idUtilisateur;
}