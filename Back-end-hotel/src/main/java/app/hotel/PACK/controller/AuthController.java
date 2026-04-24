package app.hotel.PACK.controller;

import app.hotel.PACK.DTO.InscriptionRequestDTO;
import app.hotel.PACK.DTO.InscriptionResponseDTO;
import app.hotel.PACK.services.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ClientService clientService;

    @PostMapping("/inscription")
    public ResponseEntity<InscriptionResponseDTO> inscrire(
            @Valid @RequestBody InscriptionRequestDTO dto) {

        InscriptionResponseDTO response = clientService.inscrireClient(dto);

        if (!response.isSucces()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}