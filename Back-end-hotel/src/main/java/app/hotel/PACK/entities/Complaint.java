package app.hotel.PACK.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complaint")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private String id;

    // 'complaint' pour une plainte, 'special-request' pour une demande spéciale
    @Column(name = "type", nullable = false)
    private String type;

    // Uniquement pour les plaintes (type = 'complaint')
    @Column(name = "priority")
    private String priority;

    // Uniquement pour les demandes spéciales (type = 'special-request')
    @Column(name = "preference_type")
    private String preferenceType;

    // Uniquement pour les plaintes
    @Column(name = "subject")
    private String subject;

    @Column(name = "details", nullable = false)
    private String details;

    // Uniquement pour les demandes spéciales — format dd/mm/yyyy
    @Column(name = "requested_date")
    private String requestedDate;

    @Column(name = "status", nullable = false)
    private String status;

    // Plusieurs complaints appartiennent à un seul client
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idclient", nullable = false)
    private Client client;
}