package app.hotel.PACK.Util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JsonWebUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    // Creer la cle une seule fois
    private SecretKey getSigningKey() {
        // Validation stricte : minimum 64 caracteres
        if (jwtSecret == null || jwtSecret.length() < 64) {
            throw new IllegalArgumentException(
                String.format(
                    "ERREUR CRITIQUE : La cle JWT est trop courte!%n" +
                    "Actuellement : %d caracteres%n" +
                    "Requis : 64+ caracteres (512+ bits pour HS512)%n" +
                    "Cle actuelle : '%s'",
                    jwtSecret != null ? jwtSecret.length() : 0,
                    jwtSecret
                )
            );
        }
        
        System.out.println("[JWT] Cle valide : " + jwtSecret.length() + " caracteres");
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Generer un token
    	public String generateToken(String userId, String role) {
    	    return Jwts.builder()
    	            .subject(userId)
    	            .claim("role", role)  // ✅ Ajouter le rôle
    	            .issuedAt(new Date())
    	            .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
    	            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
    	            .compact();
    	}

    	// ✅ Ajouter cette méthode
    	public String getRoleFromToken(String token) {
    	    return Jwts.parser()
    	            .verifyWith(getSigningKey())
    	            .build()
    	            .parseSignedClaims(token)
    	            .getPayload()
    	            .get("role", String.class);
    	}

    // Recuperer l'ID utilisateur du token
    public String getUserIdFromToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (Exception e) {
            throw new IllegalArgumentException("Token invalide: " + e.getMessage(), e);
        }
    }

    // Valider le token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            System.err.println("[JWT] Erreur de validation du token: " + e.getMessage());
            return false;
        }
    }
}