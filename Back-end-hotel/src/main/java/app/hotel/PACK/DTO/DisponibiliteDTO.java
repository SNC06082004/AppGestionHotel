package app.hotel.PACK.DTO;

import java.util.List;

import lombok.*;

@Getter
@Setter 
@Builder 
@NoArgsConstructor
@AllArgsConstructor
public class DisponibiliteDTO {
    private boolean disponible;
    private List<ChambreSelectDTO> chambresDisponibles; // chambres trouvées
    private List<Integer> capacitesAlternatives;        // si indispo, capacités dispo
    private String message;
    private Double prixTotal;
}