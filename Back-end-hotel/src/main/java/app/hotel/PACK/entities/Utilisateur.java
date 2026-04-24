package app.hotel.PACK.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateur")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idutilisateur")
    private Integer idUtilisateur; // Auto-incrémenté, jamais saisi par l'utilisateur

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "prenom", nullable = false)
    private String prenom;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "motdepasse", nullable = false)
    private String motDePasse;

    public String seConnecter() {
        return "Connexion de " + email;
    }

    public String seDeconnecter() {
        return "Deconnexion de " + email;
    }
}