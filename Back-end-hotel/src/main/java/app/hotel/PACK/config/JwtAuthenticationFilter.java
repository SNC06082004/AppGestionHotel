package app.hotel.PACK.config;

import app.hotel.PACK.Util.JsonWebUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JsonWebUtil jsonWebUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Récupérer le token du header Authorization
            String authHeader = request.getHeader("Authorization");
            String requestPath = request.getRequestURI();
            
            System.out.println("[JWT Filter] Path: " + requestPath);
            System.out.println("[JWT Filter] Authorization header: " + (authHeader != null ? "Présent" : "Absent"));
            
            // Si le token est présent
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7); // Enlever "Bearer "
                
                System.out.println("[JWT Filter] Token trouvé: " + token.substring(0, Math.min(20, token.length())) + "...");
                
                // Valider le token
                if (jsonWebUtil.validateToken(token)) {
                    String userId = jsonWebUtil.getUserIdFromToken(token);
                    System.out.println("[JWT Filter] ✅ Token valide pour userId: " + userId);
                    
                    // ✅ Créer une authentification avec des autorités
                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_USER")
                    );
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userId, null, authorities);
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("[JWT Filter] ✅ Authentification définie avec succès");
                } else {
                    System.err.println("[JWT Filter] ❌ Token invalide ou expiré");
                }
            } else {
                System.out.println("[JWT Filter] ⚠️ Pas de token Authorization");
            }
        } catch (Exception e) {
            System.err.println("[JWT Filter] ❌ Erreur lors du traitement du token: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Continuer la chaîne de filtres
        filterChain.doFilter(request, response);
    }
}