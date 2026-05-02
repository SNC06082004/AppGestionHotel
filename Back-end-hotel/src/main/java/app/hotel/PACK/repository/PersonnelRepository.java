package app.hotel.PACK.repository;

import app.hotel.PACK.entities.Personnel;
import app.hotel.PACK.entities.enums.RoleAffectation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, Integer> {
    
    List<Personnel> findByType(RoleAffectation type);
}

