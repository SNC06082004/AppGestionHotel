package app.hotel.PACK.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administrateur")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Administrateur extends Utilisateur {
    // Hérite de tous les champs d'Utilisateur
}

