package app.hotel.PACK.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartDuJourDTO {

    private Integer reservationId;
    private Integer clientId;
    private String clientNom;       // prenom + nom
    private String clientTelephone;
    private String clientEmail;

    private String numeroChambre;
    private String typeChambre;
    private String statutChambre;   // statut actuel de la chambre

    private String checkIn;
    private String checkOut;        // = aujourd'hui

    // true si le départ a déjà été enregistré (chambre EN_NETTOYAGE ou DISPONIBLE)
    private Boolean departEffectue;
}