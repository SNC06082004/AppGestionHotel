package app.hotel.PACK.DTO;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequestDTO {
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, message = "Minimum 2 caractères")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, message = "Minimum 2 caractères")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^\\+?[0-9\\s]{8,15}$", message = "Format invalide")
    private String telephone;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Minimum 6 caractères")
    private String motDePasse;

    @NotBlank(message = "Le type d'utilisateur est obligatoire")
    private String userType; // CLIENT, PERSONNEL, RECEPTIONNISTE, ADMIN
}