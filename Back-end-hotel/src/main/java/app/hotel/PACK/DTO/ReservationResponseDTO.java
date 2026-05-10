package app.hotel.PACK.DTO;
import lombok.*;
//ReservationResponseDTO.java — réponse après création
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ReservationResponseDTO {
 private Integer idReservation;
 private String reference;
 private String nomClient;
 private String emailClient;
 private String typeChambre;
 private String numeroChambre;
 private Integer etage;
 private Double prix;
 private Double prixTotal;
 private String checkIn;
 private String checkOut;
 private Integer nuits;
 private Double adultes;
 private Double enfants;
}