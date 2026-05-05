package app.hotel.PACK.services;

import app.hotel.PACK.DTO.PersonnelDTO;
import app.hotel.PACK.entities.Personnel;
import app.hotel.PACK.entities.enums.RoleAffectation;
import app.hotel.PACK.repository.PersonnelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PersonnelServiceImpl implements PersonnelService {

    private final PersonnelRepository personnelRepository;

    @Override
    public List<PersonnelDTO> getAllPersonnel() {
        log.info("📋 Récupération de tout le personnel");
        return personnelRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PersonnelDTO> getByType(RoleAffectation type) {
        log.debug("🔍 Recherche personnel par type: {}", type);
        return personnelRepository.findByType(type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PersonnelDTO> getCleaningStaff() {
        log.debug("🧹 Récupération du personnel nettoyage");
        return this.getByType(RoleAffectation.FEMME_DE_CHAMBRE);
    }

    @Override
    public List<PersonnelDTO> getMaintenanceStaff() {
        log.debug("🔧 Récupération du personnel maintenance");
        return this.getByType(RoleAffectation.TECHNICIEN);
    }

    private PersonnelDTO convertToDTO(Personnel personnel) {
        return PersonnelDTO.builder()
                .id(personnel.getIdUtilisateur())
                .nom(personnel.getNom())
                .prenom(personnel.getPrenom())
                .email(personnel.getEmail())
                .telephone(personnel.getTelephone())
                .roleAffectation(personnel.getType()) // ✅ était .type() → erreur
                .build();
    }
}