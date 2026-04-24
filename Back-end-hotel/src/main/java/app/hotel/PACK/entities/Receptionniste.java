package app.hotel.PACK.entities;


import jakarta.persistence.*;
import lombok.*;
 
@Entity
@Table(name = "receptionniste")
@DiscriminatorValue("RECEPTIONNISTE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Receptionniste extends Personnel {
 
    // Pas de @Id ici — il est hérité de Utilisateur via Personnel (idutilisateur)
    @Column(name = "idreception")
    private Integer idReception;
 
    @Column(name = "type")
    private Integer type;
 
    public String creerClient() {
        return "Client cree par la receptionniste";
    }
 
    public String modifierClient() {
        return "Client modifie par la receptionniste";
    }
}
 
