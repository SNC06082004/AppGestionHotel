package app.hotel.PACK.services;

import app.hotel.PACK.DTO.CarteFideliteDTO;
import java.util.List;
import java.util.Optional;

public interface CarteFideliteService {

    // Créer une carte pour un client (appelé automatiquement à l'inscription ou au 1er séjour)
    CarteFideliteDTO creerCarte(Integer clientId);

    // Récupérer toutes les cartes
    List<CarteFideliteDTO> getAllCartes();

    // Récupérer la carte d'un client
    Optional<CarteFideliteDTO> getCarteByClientId(Integer clientId);

    // Ajouter des points manuellement (motif : séjour complété, parrainage, etc.)
    CarteFideliteDTO ajouterPoints(Integer clientId, Double points);

    // Appelé automatiquement quand un séjour est complété (depuis DepartService)
    CarteFideliteDTO enregistrerSejour(Integer clientId);

    // Récupérer ou créer la carte d'un client
    CarteFideliteDTO getOuCreerCarte(Integer clientId);
}