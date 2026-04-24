package app.hotel.PACK.entities;

import app.hotel.PACK.entities.enums.Tier;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cartefidelite")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarteFidelite {

    @Id
    @Column(name = "idcart")
    private String idCart;

    @Column(name = "initiale")
    private String initiale;

    @Column(name = "nom")
    private String nom;

    @Column(name = "numero")
    private String numero;

    @Enumerated(EnumType.STRING)
    @Column(name = "tier")
    private Tier tier;

    @Column(name = "point")
    private Double point;

    @Column(name = "palliersuivant")
    private Double pallierSuivant;

    @Column(name = "sejours")
    private Double sejours;

    @Column(name = "membredepuis")
    private String membreDepuis;

    // Une carte appartient à un seul client (1..1), un client a au plus 1 carte (0..1)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idclient", nullable = false, unique = true)
    private Client client;
}
