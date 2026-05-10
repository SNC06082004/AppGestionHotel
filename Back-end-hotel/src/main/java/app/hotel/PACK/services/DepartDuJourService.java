package app.hotel.PACK.services;

import app.hotel.PACK.DTO.DepartDuJourDTO;
import java.util.List;

public interface DepartDuJourService {

    // Récupérer tous les départs du jour (checkOut = aujourd'hui)
    List<DepartDuJourDTO> getDepartsDuJour();

    // Marquer un départ comme effectué :
    // → passe la chambre en EN_NETTOYAGE
    // → enregistre +1 séjour + points fidélité pour le client
    DepartDuJourDTO marquerDepartEffectue(Integer reservationId);
}