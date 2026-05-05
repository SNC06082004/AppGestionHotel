package app.hotel.PACK.entities;

import app.hotel.PACK.entities.enums.RoleAffectation;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "affectation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Affectation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idaffectation")
    private Integer idAffectation;

    @Column(name = "datedebut")
    private LocalDate dateDebut;

    @Column(name = "datefin")
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private RoleAffectation role;

    // Plusieurs affectations appartiennent à un seul personnel (1..1 côté personnel)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idpersonnel", nullable = false)
    private Personnel personnel;
}


