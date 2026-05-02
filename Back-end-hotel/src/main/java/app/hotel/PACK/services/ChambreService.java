package app.hotel.PACK.services;

import app.hotel.PACK.DTO.*;
import app.hotel.PACK.entities.enums.RoomType;
import app.hotel.PACK.entities.enums.RoomStatut;
import java.util.List;
import java.util.Optional;

public interface ChambreService {
    // CRUD
    ChambreDTO createChambre(CreateChambreRequest request);
    Optional<ChambreDTO> getChambreById(Integer id);
    List<ChambreDTO> getAllChambres();
    ChambreDTO updateChambre(Integer id, UpdateChambreRequest request);
    void deleteChambre(Integer id);

    // Filtrage
    List<ChambreDTO> getChambresByStatus(RoomStatut status);
    List<ChambreDTO> getChambresByType(RoomType type);
    List<ChambreDTO> getChambresByFloor(Integer floor);

    // Gestion statuts
    ChambreDTO assignCleaning(Integer chambreId, AssignCleaningRequest request);
    ChambreDTO assignMaintenance(Integer chambreId, AssignMaintenanceRequest request);
    ChambreDTO assignGuest(Integer chambreId, AssignGuestRequest request);
    ChambreDTO checkout(Integer chambreId);
    ChambreDTO markAvailable(Integer chambreId);
}