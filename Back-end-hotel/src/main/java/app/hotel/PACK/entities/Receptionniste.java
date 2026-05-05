package app.hotel.PACK.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "receptionniste")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Receptionniste extends Utilisateur {

    public String creerClient() {
        return "Client cree par la receptionniste";
    }

    public String modifierClient() {
        return "Client modifie par la receptionniste";
    }
}

