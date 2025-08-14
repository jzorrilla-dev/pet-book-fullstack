Adopción de Mascotas v2
Descripción del Proyecto
Este es un proyecto full-stack diseñado para facilitar el proceso de adopción de mascotas. La plataforma conecta a personas interesadas en adoptar con organizaciones y refugios que buscan un hogar para los animales. La aplicación permite a los usuarios buscar mascotas, ver detalles de cada una y contactar a los responsables. Además permite publicar mascotas que se hayan extraviado, con la opción de agregar una foto del animal.

Tecnologías Utilizadas
El proyecto está construido con un enfoque de microservicios, utilizando un stack de tecnologías modernas.

Backend
Laravel: Framework de PHP para el desarrollo del backend RESTful API.

PostgreSQL: Sistema de gestión de bases de datos para almacenar la información de usuarios y mascotas.

PHPUnit: Framework para pruebas unitarias.

Frontend
React: Biblioteca de JavaScript para la construcción de la interfaz de usuario.

TypeScript: Lenguaje que añade tipado estático a JavaScript, mejorando la robustez del código.

Tailwind CSS: Framework de CSS para un desarrollo de interfaz rápido y responsivo.

Infraestructura
Docker: Herramienta de contenedorización para empaquetar la aplicación y sus dependencias.

Docker Compose: Herramienta para definir y ejecutar aplicaciones multi-contenedor, permitiendo un entorno de desarrollo consistente.

Instalación y Configuración
Sigue estos pasos para poner en marcha el proyecto en tu máquina local usando Docker Compose.

1. Clonar el repositorio
Clona este repositorio en tu máquina local.

git clone https://github.com/tu-usuario/nombre-de-tu-repositorio.git
cd nombre-de-tu-repositorio

2. Configuración del Entorno
Copia los archivos de entorno de ejemplo para el backend y el frontend.

cp adopcion-mascotas-backend-v2/.env.example adopcion-mascotas-backend-v2/.env

Asegúrate de configurar las variables de entorno en el archivo .env del backend (por ejemplo, las credenciales de la base de datos).

3. Ejecutar con Docker Compose
Desde el directorio raíz del proyecto, ejecuta el siguiente comando.

docker-compose up --build -d

Esto construirá las imágenes de Docker y levantará los servicios (backend, frontend y base de datos) en segundo plano.

Uso
Una vez que Docker Compose ha finalizado, la aplicación estará accesible en tu navegador.

Frontend: http://localhost:3000 (o el puerto que hayas configurado).

Backend API: http://localhost:8000 (o el puerto que hayas configurado).

Contribuciones
¡Las contribuciones son bienvenidas! Siéntete libre de abrir pull requests o reportar issues.

Contacto
Juan Zorrilla  - [Tu Enlace a LinkedIn o Portfolio]
