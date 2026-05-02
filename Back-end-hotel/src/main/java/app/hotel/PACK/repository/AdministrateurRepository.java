package app.hotel.PACK.repository;

import app.hotel.PACK.entities.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Integer> {
    boolean existsByEmail(String email);
    Optional<Administrateur> findByEmail(String email);
}