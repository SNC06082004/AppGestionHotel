package app.hotel.PACK.entities;

import app.hotel.PACK.entities.enums.Statut;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "demande")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Demande {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "chambre")
    private String chambre;

    @Column(name = "type")
    private String type;

    @Column(name = "detail")
    private String detail;

    @Column(name = "datesouhaitee")
    private String dateSouhaitee;

    // Corrigé : 'sattut' dans le diagramme → enum Statut
    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private Statut statut;

    // Plusieurs demandes pour un seul client — un client fait 1..* demandes, une demande vient d'1 seul client
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idclient", nullable = false)
    private Client client;
}