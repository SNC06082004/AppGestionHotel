package app.hotel.PACK.repository;

import app.hotel.PACK.entities.CarteFidelite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CarteFideliteRepository extends JpaRepository<CarteFidelite, Integer> {

    // Trouver la carte d'un client par son ID
    @Query("SELECT c FROM CarteFidelite c WHERE c.client.idUtilisateur = :clientId")
    Optional<CarteFidelite> findByClientId(@Param("clientId") Integer clientId);

    // Vérifier si un client a déjà une carte
    @Query("SELECT COUNT(c) > 0 FROM CarteFidelite c WHERE c.client.idUtilisateur = :clientId")
    boolean existsByClientId(@Param("clientId") Integer clientId);

    // Toutes les cartes triées par points décroissants
    @Query("SELECT c FROM CarteFidelite c ORDER BY c.point DESC")
    List<CarteFidelite> findAllOrderByPointsDesc();
}

