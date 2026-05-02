package app.hotel.PACK.repository;


import app.hotel.PACK.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {

    boolean existsByEmail(String email);

    Optional<Client> findByEmail(String email);
}


