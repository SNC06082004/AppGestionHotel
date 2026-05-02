package app.hotel.PACK.entities.enums;

public enum RoomType {
    SIMPLE("Chambre Simple"),
    DOUBLE("Chambre Double"),
    SUITE("Suite"),
    FAMILIALE("Chambre Familiale"),
    DELUXE("Chambre Deluxe"),
    PRESIDENTIELLE("Suite Présidentielle");
    
    private final String displayName;
    
    RoomType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
