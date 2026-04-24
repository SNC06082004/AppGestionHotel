package app.hotel.PACK.services;

import app.hotel.PACK.DTO.InscriptionRequestDTO;
import app.hotel.PACK.DTO.InscriptionResponseDTO;

public interface ClientService {
    InscriptionResponseDTO inscrireClient(InscriptionRequestDTO dto);
}