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
    private String userType;
    // Chambre de la réservation active (null si pas de réservation en cours)
    private String chambreActive;   // numéro de chambre ex: "204"

    // Dates de la réservation active
    private String checkIn;
    private String checkOut;

    // Nombre total de séjours (taille de la liste reservations)
    private Integer nombreSejours;
}

