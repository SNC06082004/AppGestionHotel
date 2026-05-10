package app.hotel.PACK.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.hotel.PACK.entities.Chambre;
import app.hotel.PACK.entities.Reservation;
import app.hotel.PACK.entities.enums.RoomType;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByClient_IdUtilisateur(Integer clientId);

    // ✅ Chambres occupées qui chevauchent la période demandée
    @Query("""
        SELECT DISTINCT c FROM Chambre c
        JOIN c.reservations r
        WHERE c.type = :type
        AND r.checkIn < :checkOut
        AND r.checkOut > :checkIn
    """)
    List<Chambre> findChambresOccupeesParTypeSurPeriode(
        @Param("type") RoomType type,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );

    // ✅ Réservations dont le checkout est dépassé (pour le job planifié)
    @Query("SELECT r FROM Reservation r WHERE r.checkOut < :today")
    List<Reservation> findReservationsExpirees(@Param("today") LocalDate today);
    
    // Réservations dont le checkout est une date précise (pour les départs du jour)
    @Query("SELECT r FROM Reservation r WHERE r.checkOut = :date")
    List<Reservation> findByCheckOut(@Param("date") LocalDate date);
 
    // Réservation active d'un client (checkIn <= aujourd'hui <= checkOut)
    @Query("""
        SELECT r FROM Reservation r
        WHERE r.client.idUtilisateur = :clientId
          AND r.checkIn  <= :today
          AND r.checkOut >= :today
        ORDER BY r.checkIn DESC
    """)
    List<Reservation> findReservationsActives(
        @Param("clientId") Integer clientId,
        @Param("today")    LocalDate today
    );
}
