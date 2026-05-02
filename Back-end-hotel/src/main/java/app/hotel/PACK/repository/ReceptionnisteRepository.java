package app.hotel.PACK.repository;

import app.hotel.PACK.entities.Receptionniste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceptionnisteRepository extends JpaRepository<Receptionniste, Integer> {
    List<Receptionniste> findAll();
}

