package app.hotel.PACK.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "client")
@DiscriminatorValue("CLIENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Client extends Utilisateur {

    // idUtilisateur hérité de Utilisateur

    // Remplacement de plaintes + demandes par une seule liste de complaints
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Complaint> complaints;

    @OneToOne(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CarteFidelite carteFidelite;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservations;
}