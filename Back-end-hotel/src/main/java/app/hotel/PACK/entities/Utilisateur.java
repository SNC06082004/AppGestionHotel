package app.hotel.PACK.entities;

import jakarta.persistence.*;
import lombok.*;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idutilisateur")
    private Integer idUtilisateur;

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

