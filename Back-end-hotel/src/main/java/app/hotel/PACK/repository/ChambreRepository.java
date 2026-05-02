package app.hotel.PACK.repository;

import app.hotel.PACK.entities.Chambre;
import app.hotel.PACK.entities.enums.RoomType;
import app.hotel.PACK.entities.enums.RoomStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChambreRepository extends JpaRepository<Chambre, Integer> {

    // ────── VÉRIFICATION ──────
    boolean existsByNumber(String number);

    // ────── FILTRAGE ──────
    List<Chambre> findByStatut(RoomStatut statut);

    List<Chambre> findByType(RoomType type);

    @Query("SELECT c FROM Chambre c WHERE c.floor = :floor")
    List<Chambre> findByFloor(@Param("floor") Double floor);

    // ────── COMBINAISONS ──────
    @Query("SELECT c FROM Chambre c WHERE c.floor = :floor AND c.statut = :statut")
    List<Chambre> findByFloorAndStatut(@Param("floor") Double floor, @Param("statut") RoomStatut statut);

    @Query("SELECT c FROM Chambre c WHERE c.type = :type AND c.statut = :statut")
    List<Chambre> findByTypeAndStatut(@Param("type") RoomType type, @Param("statut") RoomStatut statut);

    // ────── STATISTIQUES ──────
    long countByStatut(RoomStatut statut);

    long countByType(RoomType type);
}

