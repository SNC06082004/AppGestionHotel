package app.hotel.PACK.repository;

import app.hotel.PACK.entities.Receptionniste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReceptionnisteRepository extends JpaRepository<Receptionniste, Integer> {
    List<Receptionniste> findAll();
    boolean existsByEmail(String email);
    Optional<Receptionniste> findByEmail(String email);
}

