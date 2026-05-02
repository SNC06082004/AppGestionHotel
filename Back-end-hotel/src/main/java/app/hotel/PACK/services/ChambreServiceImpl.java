package app.hotel.PACK.services;

import app.hotel.PACK.DTO.*;
import app.hotel.PACK.entities.Chambre;
import app.hotel.PACK.entities.enums.RoomType;
import app.hotel.PACK.entities.enums.RoomStatut;
import app.hotel.PACK.repository.ChambreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChambreServiceImpl implements ChambreService {

    private final ChambreRepository chambreRepository;
    private static final DateTimeFormatter FMT =
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    // ────── CREATE ──────
    @Override
    public ChambreDTO createChambre(CreateChambreRequest request) {
        if (chambreRepository.existsByNumber(request.getNumber())) {
            throw new IllegalArgumentException(
                "Chambre " + request.getNumber() + " existe déjà");
        }

        Chambre chambre = Chambre.builder()
            .number(request.getNumber())
            .floor(request.getFloor().doubleValue())
            .type(request.getType())
            .capacity(request.getCapacity().doubleValue())
            .price(request.getPrice())
            .statut(RoomStatut.DISPONIBLE)
            .staff(request.getStaff())
            .notes(request.getNotes())
            .build();

        return convertToDTO(chambreRepository.save(chambre));
    }

    // ────── READ ──────
    @Override
    @Transactional(readOnly = true)
    public Optional<ChambreDTO> getChambreById(Integer id) {
        return chambreRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChambreDTO> getAllChambres() {
        return chambreRepository.findAll()
            .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // ────── UPDATE ──────
    @Override
    public ChambreDTO updateChambre(Integer id, UpdateChambreRequest request) {
        Chambre chambre = chambreRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Chambre non trouvée: " + id));

        if (request.getNumber()   != null) chambre.setNumber(request.getNumber());
        if (request.getFloor()    != null) chambre.setFloor(request.getFloor().doubleValue());
        if (request.getType()     != null) chambre.setType(request.getType());
        if (request.getCapacity() != null) chambre.setCapacity(request.getCapacity().doubleValue());
        if (request.getPrice()    != null) chambre.setPrice(request.getPrice());
        if (request.getStaff()    != null) chambre.setStaff(request.getStaff());
        if (request.getNotes()    != null) chambre.setNotes(request.getNotes());

        return convertToDTO(chambreRepository.save(chambre));
    }

    // ────── DELETE ──────
    @Override
    public void deleteChambre(Integer id) {
        if (!chambreRepository.existsById(id))
            throw new IllegalArgumentException("Chambre non trouvée: " + id);
        chambreRepository.deleteById(id);
    }

    // ────── FILTRAGE ──────
    @Override
    @Transactional(readOnly = true)
    public List<ChambreDTO> getChambresByStatus(RoomStatut status) {
        return chambreRepository.findByStatut(status)
            .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChambreDTO> getChambresByType(RoomType type) {
        return chambreRepository.findByType(type)
            .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChambreDTO> getChambresByFloor(Integer floor) {
        return chambreRepository.findByFloor(floor.doubleValue())
            .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // ────── STATUTS ──────
    @Override
    public ChambreDTO assignCleaning(Integer id, AssignCleaningRequest request) {
        Chambre c = findOrThrow(id);
        c.setStatut(RoomStatut.EN_NETTOYAGE);
        c.setStaff(request.getStaff());
        return convertToDTO(chambreRepository.save(c));
    }

    @Override
    public ChambreDTO assignMaintenance(Integer id, AssignMaintenanceRequest request) {
        Chambre c = findOrThrow(id);
        c.setStatut(RoomStatut.EN_MAINTENANCE);
        c.setStaff(request.getStaff());
        c.setNotes(request.getNotes());
        return convertToDTO(chambreRepository.save(c));
    }

    @Override
    public ChambreDTO assignGuest(Integer id, AssignGuestRequest request) {
        Chambre c = findOrThrow(id);
        c.setStatut(RoomStatut.OCCUPEE);
        c.setStaff(null);
        return convertToDTO(chambreRepository.save(c));
    }

    @Override
    public ChambreDTO checkout(Integer id) {
        Chambre c = findOrThrow(id);
        c.setStatut(RoomStatut.EN_NETTOYAGE);
        c.setStaff(null);
        return convertToDTO(chambreRepository.save(c));
    }

    @Override
    public ChambreDTO markAvailable(Integer id) {
        Chambre c = findOrThrow(id);
        c.setStatut(RoomStatut.DISPONIBLE);
        c.setStaff(null);
        c.setNotes(null);
        return convertToDTO(chambreRepository.save(c));
    }

    // ────── UTILITAIRES ──────
    private Chambre findOrThrow(Integer id) {
        return chambreRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Chambre non trouvée: " + id));
    }

    private ChambreDTO convertToDTO(Chambre c) {
        return ChambreDTO.builder()
            .id(c.getIdChambre())
            .number(c.getNumber())
            .floor(c.getFloor().intValue())
            .type(c.getType())
            .status(c.getStatut())        // ← champ "status" dans le DTO
            .capacity(c.getCapacity().intValue())
            .price(c.getPrice())
            .staff(c.getStaff())
            .notes(c.getNotes())
            .createdAt(c.getCreatedAt().format(FMT))
            .updatedAt(c.getUpdatedAt().format(FMT))
            .build();
    }
}