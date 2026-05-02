package app.hotel.PACK.entities;

import app.hotel.PACK.entities.enums.RoomStatut;
import app.hotel.PACK.entities.enums.RoomType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chambre")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chambre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idchambre")
    private Integer idChambre;

    @Column(name = "number", nullable = false, unique = true)
    private String number;

    @Column(name = "floor", nullable = false)
    private Double floor;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private RoomType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private RoomStatut statut;

    @Column(name = "capacity", nullable = false)
    private Double capacity;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "staff")
    private String staff;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Relation avec Reservation
    @ManyToMany(mappedBy = "chambres", fetch = FetchType.LAZY)
    private List<Reservation> reservations;

    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

