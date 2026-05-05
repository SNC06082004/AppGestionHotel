package app.hotel.PACK.entities;

import app.hotel.PACK.entities.enums.RoleAffectation;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "personnel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Personnel extends Utilisateur {

    @Enumerated(EnumType.STRING)
    @Column(name = "type_personnel", nullable = false)
    private RoleAffectation type;

    @OneToMany(mappedBy = "personnel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Affectation> affectations;
}

