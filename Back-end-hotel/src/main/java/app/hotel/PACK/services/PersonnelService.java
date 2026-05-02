package app.hotel.PACK.services;

import app.hotel.PACK.DTO.PersonnelDTO;
import app.hotel.PACK.entities.enums.RoleAffectation;
import java.util.List;

public interface PersonnelService {
    List<PersonnelDTO> getAllPersonnel();
    List<PersonnelDTO> getByType(RoleAffectation type);
    List<PersonnelDTO> getCleaningStaff();
    List<PersonnelDTO> getMaintenanceStaff();
}