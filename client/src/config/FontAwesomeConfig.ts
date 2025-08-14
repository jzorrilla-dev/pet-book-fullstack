// src/config/fontAwesomeConfig.ts
import { library } from "@fortawesome/fontawesome-svg-core";

// Importa íconos sólidos
import {
  faPaw,
  faHeart,
  faHome,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

// Importa íconos de marcas (redes sociales)
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

// Agrega los íconos a la librería de Font Awesome
library.add(
  faPaw,
  faHeart,
  faHome,
  faEnvelope,
  faPhone,
  faFacebook,
  faInstagram
);

export default library;
