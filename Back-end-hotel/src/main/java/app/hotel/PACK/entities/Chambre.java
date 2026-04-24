package app.hotel.PACK.entities;

import app.hotel.PACK.entities.enums.RoomStatut;
import app.hotel.PACK.entities.enums.RoomType;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "chambre")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chambre {

    @Id
    @Column(name = "idchambre")
    private String idChambre;

    @Column(name = "number")
    private String number;

    @Column(name = "floor")
    private Double floor;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private RoomType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private RoomStatut statut;

    @Column(name = "capacity")
    private Double capacity;

    @Column(name = "price")
    private Double price;

    @Column(name = "role")
    private String role;

    // Une chambre peut être dans plusieurs réservations (1..*)
    @ManyToMany(mappedBy = "chambres", fetch = FetchType.LAZY)
    private List<Reservation> reservations;
}
