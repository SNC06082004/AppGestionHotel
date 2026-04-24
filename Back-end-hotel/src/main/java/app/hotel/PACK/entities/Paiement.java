package app.hotel.PACK.entities;



import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "paiement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Paiement {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "sub")
    private String sub;

    @Column(name = "initials")
    private String initials;

    @Column(name = "iconclass")
    private String iconClass;

    @Column(name = "mobile")
    private Boolean mobile;

    // Un paiement appartient à une seule réservation (1..1), et une réservation a un seul paiement
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idreservation", nullable = false, unique = true)
    private Reservation reservation;
}
