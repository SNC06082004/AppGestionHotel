package app.hotel.PACK.entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "reservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idreservation")
    private Integer idReservation;

    @Column(name = "adultes")
    private Double adultes;

    @Column(name = "enfants")
    private Double enfants;

    @Column(name = "ageenfants")
    private Double ageEnfants;

    @Column(name = "chambrenb")
    private Double chambreNb;

    @Column(name = "avecAnimal")
    private Boolean avecAnimal;

    @Column(name = "checkin")
    private LocalDate checkIn;

    @Column(name = "checkout")
    private LocalDate checkOut;

    // Plusieurs réservations appartiennent à un seul client
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idclient", nullable = false)
    private Client client;

    // Une réservation concerne plusieurs chambres et une chambre peut être dans plusieurs réservations
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "reservation_chambre",
        joinColumns = @JoinColumn(name = "idreservation"),
        inverseJoinColumns = @JoinColumn(name = "idchambre")
    )
    private List<Chambre> chambres;

    // Une réservation peut avoir plusieurs notifications (1..*)
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notification> notifications;

    // Une réservation a exactement un paiement (1..1)
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Paiement paiement;

    // Une réservation a exactement une facture (1..1)
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Facture facture;
}

