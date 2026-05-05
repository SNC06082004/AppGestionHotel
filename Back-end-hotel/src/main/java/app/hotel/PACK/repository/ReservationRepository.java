package app.hotel.PACK.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.hotel.PACK.entities.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByClient_IdUtilisateur(Integer clientId);
}
