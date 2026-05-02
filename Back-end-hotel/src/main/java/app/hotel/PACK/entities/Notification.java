package app.hotel.PACK.entities;

import app.hotel.PACK.entities.enums.StatutNotification;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "notification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idnotification")
    private Integer idNotification;

    @Column(name = "typenotification")
    private String typeNotification;

    @Column(name = "contenu")
    private String contenu;

    @Column(name = "dateenvoi")
    private LocalDate dateEnvoi;

    @Enumerated(EnumType.STRING)
    @Column(name = "statutnotification")
    private StatutNotification statutNotification;

    // Plusieurs notifications appartiennent à une seule réservation (1..1 côté réservation)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idreservation", nullable = false)
    private Reservation reservation;
}

