package app.hotel.PACK.DTO;

import app.hotel.PACK.entities.enums.Tier;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarteFideliteDTO {

    private Integer id;

    // Infos client
    private Integer clientId;
    private String clientNom;       // prenom + nom
    private String initiales;       // ex: "KO"

    // Infos carte
    private String numero;          // ex: "LXR-0042"

    @Builder.Default
    private Tier tier = Tier.BRONZE;

    @Builder.Default
    private Double points = 0.0;

    private Double palierSuivant;   // calculé selon le tier

    private Double sejours;

    private String membreDepuis;    // ex: "avr. 2026"
}