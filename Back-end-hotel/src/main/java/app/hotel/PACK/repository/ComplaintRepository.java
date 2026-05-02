package app.hotel.PACK.repository;

import app.hotel.PACK.entities.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {

    // Récupérer toutes les plaintes/demandes d'un client
    @Query("SELECT c FROM Complaint c WHERE c.client.idUtilisateur = :clientId ORDER BY c.id DESC")
    List<Complaint> findByClientId(@Param("clientId") Integer clientId);

    // Récupérer par type (plainte ou demande spéciale)
    @Query("SELECT c FROM Complaint c WHERE c.type = :type ORDER BY c.id DESC")
    List<Complaint> findByType(@Param("type") String type);

    // Récupérer plaintes par client et type
    @Query("SELECT c FROM Complaint c WHERE c.client.idUtilisateur = :clientId AND c.type = :type ORDER BY c.id DESC")
    List<Complaint> findByClientIdAndType(@Param("clientId") Integer clientId, @Param("type") String type);

    // Récupérer par statut
    @Query("SELECT c FROM Complaint c WHERE c.status = :status ORDER BY c.id DESC")
    List<Complaint> findByStatus(@Param("status") String status);

    // Récupérer par priorité (pour les plaintes)
    @Query("SELECT c FROM Complaint c WHERE c.priority = :priority AND c.type = 'complaint' ORDER BY c.id DESC")
    List<Complaint> findByPriority(@Param("priority") String priority);
}

