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
    private final JsonWebUtil jsonWebUtil; // ✅ Seulement ça, pas de repository

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                if (jsonWebUtil.validateToken(token)) {
                    String userId = jsonWebUtil.getUserIdFromToken(token);
                    String role = jsonWebUtil.getRoleFromToken(token); // ✅ Lu depuis le token

                    List<SimpleGrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority("ROLE_" + role) // → ROLE_ADMIN
                    );

                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userId, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("[JWT Filter] ✅ Auth: ROLE_" + role);
                }
            }
        } catch (Exception e) {
            System.err.println("[JWT Filter] ❌ Erreur: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}

