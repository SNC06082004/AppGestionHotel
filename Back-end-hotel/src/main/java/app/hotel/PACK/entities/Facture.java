package app.hotel.PACK.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "facture")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idfacture")
    private Integer idFacture;

    @Column(name = "datefacture")
    private Integer dateFacture;

    @Column(name = "montanttotal")
    private Integer montantTotal;

    @Column(name = "statutfacture")
    private String statutFacture;

    // Une facture appartient à une seule réservation (1..1)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idreservation", nullable = false, unique = true)
    private Reservation reservation;
}
