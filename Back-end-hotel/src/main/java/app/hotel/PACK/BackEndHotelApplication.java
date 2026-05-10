package app.hotel.PACK;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ✅ Juste ajouter cette ligne ici
public class BackEndHotelApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackEndHotelApplication.class, args);
    }
}