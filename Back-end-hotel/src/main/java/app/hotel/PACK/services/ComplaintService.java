package app.hotel.PACK.services;

import app.hotel.PACK.DTO.ComplaintDTO;
import java.util.List;
import java.util.Optional;

public interface ComplaintService {

    // Créer une plainte ou demande spéciale
    ComplaintDTO createComplaint(ComplaintDTO complaintDTO);

    // Récupérer toutes les plaintes/demandes
    List<ComplaintDTO> getAllComplaints();

    // Récupérer par ID
    Optional<ComplaintDTO> getComplaintById(String id);

    // Récupérer par client
    List<ComplaintDTO> getComplaintsByClientId(Integer clientId);

    // Récupérer par type
    List<ComplaintDTO> getComplaintsByType(String type);

    // Récupérer par client et type
    List<ComplaintDTO> getComplaintsByClientIdAndType(Integer clientId, String type);

    // Récupérer par statut
    List<ComplaintDTO> getComplaintsByStatus(String status);

    // Récupérer par priorité (plaintes uniquement)
    List<ComplaintDTO> getComplaintsByPriority(String priority);

    // Mettre à jour une plainte/demande
    ComplaintDTO updateComplaint(String id, ComplaintDTO complaintDTO);

    // Supprimer une plainte/demande
    void deleteComplaint(String id);

    // Changer le statut
    ComplaintDTO updateStatus(String id, String newStatus);
}