package app.hotel.PACK.services;

import app.hotel.PACK.DTO.CarteFideliteDTO;
import app.hotel.PACK.entities.CarteFidelite;
import app.hotel.PACK.entities.Client;
import app.hotel.PACK.entities.enums.Tier;
import app.hotel.PACK.repository.CarteFideliteRepository;
import app.hotel.PACK.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CarteFideliteServiceImpl implements CarteFideliteService {

    private final CarteFideliteRepository carteRepository;
    private final ClientRepository clientRepository;

    // ── Règles métier ──────────────────────────────────────────────
    // Points par séjour : 10 pts par nuit (géré dans enregistrerSejour)
    // Tiers :
    //   BRONZE   :    0 – 249 pts
    //   SILVER   :  250 – 749 pts
    //   GOLD     :  750 – 1499 pts
    //   PLATINUM : 1500+ pts
    // ──────────────────────────────────────────────────────────────

    @Override
    public CarteFideliteDTO creerCarte(Integer clientId) {
        Client client = getClient(clientId);

        if (carteRepository.existsByClientId(clientId)) {
            throw new IllegalStateException("Ce client a déjà une carte fidélité.");
        }

        CarteFidelite carte = new CarteFidelite();
        carte.setClient(client);
        carte.setNom(client.getPrenom() + " " + client.getNom());
        carte.setInitiale(buildInitiales(client));
        carte.setNumero(genererNumero(clientId));
        carte.setTier(Tier.BRONZE);
        carte.setPoint(0.0);
        carte.setPallierSuivant(250.0);   // prochain tier : SILVER
        carte.setSejours(0.0);
        carte.setMembreDepuis(moisAnnee(LocalDate.now()));

        return convertToDTO(carteRepository.save(carte));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarteFideliteDTO> getAllCartes() {
        return carteRepository.findAllOrderByPointsDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CarteFideliteDTO> getCarteByClientId(Integer clientId) {
        return carteRepository.findByClientId(clientId)
                .map(this::convertToDTO);
    }

    @Override
    public CarteFideliteDTO ajouterPoints(Integer clientId, Double points) {
        CarteFidelite carte = getCarteOuLever(clientId);
        carte.setPoint(carte.getPoint() + points);
        mettreAJourTier(carte);
        return convertToDTO(carteRepository.save(carte));
    }

    @Override
    public CarteFideliteDTO enregistrerSejour(Integer clientId) {
        // Récupérer ou créer la carte
        CarteFidelite carte = carteRepository.findByClientId(clientId)
                .orElseGet(() -> {
                    // Création silencieuse si pas encore de carte
                    Client client = getClient(clientId);
                    CarteFidelite c = new CarteFidelite();
                    c.setClient(client);
                    c.setNom(client.getPrenom() + " " + client.getNom());
                    c.setInitiale(buildInitiales(client));
                    c.setNumero(genererNumero(clientId));
                    c.setTier(Tier.BRONZE);
                    c.setPoint(0.0);
                    c.setPallierSuivant(250.0);
                    c.setSejours(0.0);
                    c.setMembreDepuis(moisAnnee(LocalDate.now()));
                    return carteRepository.save(c);
                });

        // +10 points par séjour complété
        carte.setPoint(carte.getPoint() + 10.0);
        carte.setSejours(carte.getSejours() + 1.0);
        mettreAJourTier(carte);

        return convertToDTO(carteRepository.save(carte));
    }

    @Override
    public CarteFideliteDTO getOuCreerCarte(Integer clientId) {
        return carteRepository.findByClientId(clientId)
                .map(this::convertToDTO)
                .orElseGet(() -> creerCarte(clientId));
    }

    // ── Helpers privés ────────────────────────────────────────────

    private void mettreAJourTier(CarteFidelite carte) {
        double pts = carte.getPoint();

        Tier nouveauTier;
        double palierSuivant;

        if (pts >= 1500) {
            nouveauTier = Tier.PLATINUM;
            palierSuivant = pts; // palier max atteint
        } else if (pts >= 750) {
            nouveauTier = Tier.GOLD;
            palierSuivant = 1500;
        } else if (pts >= 250) {
            nouveauTier = Tier.SILVER;
            palierSuivant = 750;
        } else {
            nouveauTier = Tier.BRONZE;
            palierSuivant = 250;
        }

        carte.setTier(nouveauTier);
        carte.setPallierSuivant(palierSuivant);
    }

    private CarteFidelite getCarteOuLever(Integer clientId) {
        return carteRepository.findByClientId(clientId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Aucune carte fidélité pour le client ID: " + clientId));
    }

    private Client getClient(Integer clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Client non trouvé avec l'ID: " + clientId));
    }

    private String buildInitiales(Client client) {
        String p = client.getPrenom() != null && !client.getPrenom().isEmpty()
                ? String.valueOf(client.getPrenom().charAt(0)).toUpperCase() : "";
        String n = client.getNom() != null && !client.getNom().isEmpty()
                ? String.valueOf(client.getNom().charAt(0)).toUpperCase() : "";
        return p + n;
    }

    private String genererNumero(Integer clientId) {
        return String.format("LXR-%04d", clientId);
    }

    private String moisAnnee(LocalDate date) {
        String mois = date.getMonth()
                .getDisplayName(TextStyle.SHORT, Locale.FRENCH)
                .replace(".", "");
        return mois + ". " + date.getYear();
    }

    private CarteFideliteDTO convertToDTO(CarteFidelite carte) {
        return CarteFideliteDTO.builder()
                .id(carte.getIdCart())
                .clientId(carte.getClient().getIdUtilisateur())
                .clientNom(carte.getNom())
                .initiales(carte.getInitiale())
                .numero(carte.getNumero())
                .tier(carte.getTier())
                .points(carte.getPoint())
                .palierSuivant(carte.getPallierSuivant())
                .sejours(carte.getSejours())
                .membreDepuis(carte.getMembreDepuis())
                .build();
    }
}

