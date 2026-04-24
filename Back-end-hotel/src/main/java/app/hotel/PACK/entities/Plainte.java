package app.hotel.PACK.entities;



import app.hotel.PACK.entities.enums.Statut;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "plainte")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Plainte {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "chambre")
    private String chambre;

    @Column(name = "objet")
    private String objet;

    @Column(name = "priorite")
    private String priorite;

    @Column(name = "date")
    private String date;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private Statut statut;

    // Plusieurs plaintes appartiennent à un seul client (1..1 côté client)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idclient", nullable = false)
    private Client client;
}
