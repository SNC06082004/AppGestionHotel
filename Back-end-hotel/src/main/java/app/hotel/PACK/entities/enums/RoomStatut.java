package app.hotel.PACK.entities.enums;

public enum RoomStatut {
    DISPONIBLE("Disponible"),
    OCCUPEE("Occupée"),
    EN_NETTOYAGE("En nettoyage"),
    EN_MAINTENANCE("En maintenance"),
    RESERVEE("Réservée");

    private final String displayName;

    RoomStatut(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}