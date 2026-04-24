package app.hotel.PACK.entities;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;
 
@Entity
@Table(name = "personnel")
@DiscriminatorValue("PERSONNEL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Personnel extends Utilisateur {
 
    // Pas de @Id ici — il est hérité de Utilisateur (idutilisateur)
    @Column(name = "idpersonnel")
    private Integer idPersonnel;
 
    @OneToMany(mappedBy = "personnel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Affectation> affectations;
}