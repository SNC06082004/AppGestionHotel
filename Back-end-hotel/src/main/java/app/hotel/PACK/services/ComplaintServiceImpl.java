package app.hotel.PACK.services;

import app.hotel.PACK.DTO.ComplaintDTO;
import app.hotel.PACK.entities.Complaint;
import app.hotel.PACK.entities.Client;
import app.hotel.PACK.repository.ComplaintRepository;
import app.hotel.PACK.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ClientRepository clientRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @Override
    public ComplaintDTO createComplaint(ComplaintDTO complaintDTO) {
        // Vérifier que le client existe
        Client client = clientRepository.findById(complaintDTO.getClientId())
                .orElseThrow(() -> new IllegalArgumentException("Client non trouvé avec l'ID: " + complaintDTO.getClientId()));

        // Créer l'entité Complaint
        Complaint complaint = new Complaint();
        complaint.setType(complaintDTO.getType());
        complaint.setClient(client);
        complaint.setDetails(complaintDTO.getDetails());
        complaint.setStatus(complaintDTO.getStatus() != null ? complaintDTO.getStatus() : "En attente");

        // Champs spécifiques aux plaintes
        if ("complaint".equals(complaintDTO.getType())) {
            complaint.setPriority(complaintDTO.getPriority() != null ? complaintDTO.getPriority() : "Normale");
            complaint.setSubject(complaintDTO.getSubject());
        }

        // Champs spécifiques aux demandes spéciales
        if ("special-request".equals(complaintDTO.getType())) {
            complaint.setPreferenceType(complaintDTO.getPreferenceType());
            complaint.setRequestedDate(complaintDTO.getRequestedDate());
        }

        Complaint savedComplaint = complaintRepository.save(complaint);
        return convertToDTO(savedComplaint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDTO> getAllComplaints() {
        return complaintRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ComplaintDTO> getComplaintById(String id) {
        return complaintRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDTO> getComplaintsByClientId(Integer clientId) {
        return complaintRepository.findByClientId(clientId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDTO> getComplaintsByType(String type) {
        return complaintRepository.findByType(type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDTO> getComplaintsByClientIdAndType(Integer clientId, String type) {
        return complaintRepository.findByClientIdAndType(clientId, type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDTO> getComplaintsByStatus(String status) {
        return complaintRepository.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDTO> getComplaintsByPriority(String priority) {
        return complaintRepository.findByPriority(priority)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ComplaintDTO updateComplaint(String id, ComplaintDTO complaintDTO) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plainte non trouvée avec l'ID: " + id));

        // Mise à jour des champs communs
        complaint.setDetails(complaintDTO.getDetails());
        complaint.setStatus(complaintDTO.getStatus());

        // Mise à jour des champs spécifiques aux plaintes
        if ("complaint".equals(complaint.getType())) {
            complaint.setPriority(complaintDTO.getPriority());
            complaint.setSubject(complaintDTO.getSubject());
        }

        // Mise à jour des champs spécifiques aux demandes spéciales
        if ("special-request".equals(complaint.getType())) {
            complaint.setPreferenceType(complaintDTO.getPreferenceType());
            complaint.setRequestedDate(complaintDTO.getRequestedDate());
        }

        Complaint updatedComplaint = complaintRepository.save(complaint);
        return convertToDTO(updatedComplaint);
    }

    @Override
    public void deleteComplaint(String id) {
        if (!complaintRepository.existsById(id)) {
            throw new IllegalArgumentException("Plainte non trouvée avec l'ID: " + id);
        }
        complaintRepository.deleteById(id);
    }

    @Override
    public ComplaintDTO updateStatus(String id, String newStatus) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plainte non trouvée avec l'ID: " + id));

        complaint.setStatus(newStatus);
        Complaint updatedComplaint = complaintRepository.save(complaint);
        return convertToDTO(updatedComplaint);
    }

    // Convertir Complaint en ComplaintDTO
    private ComplaintDTO convertToDTO(Complaint complaint) {
        return ComplaintDTO.builder()
                .id(complaint.getId())
                .clientId(complaint.getClient().getIdUtilisateur())
                .clientName(complaint.getClient().getPrenom() + " " + complaint.getClient().getNom())
                .type(complaint.getType())
                .priority(complaint.getPriority())
                .preferenceType(complaint.getPreferenceType())
                .subject(complaint.getSubject())
                .details(complaint.getDetails())
                .requestedDate(complaint.getRequestedDate())
                .status(complaint.getStatus())
                .createdAt(LocalDateTime.now().format(DATE_FORMATTER))
                .updatedAt(LocalDateTime.now().format(DATE_FORMATTER))
                .build();
    }
}