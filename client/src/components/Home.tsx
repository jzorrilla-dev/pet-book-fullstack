// Home.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faHeart, faHome } from "@fortawesome/free-solid-svg-icons";
import MascotaDetalle from "./MascotaDetalle";
import { getPets } from "../services/api";
import { Pet } from "../Types/Pet";
import { handleTestSession } from "../services/api";

const Home = () => {
  const [featuredPet, setFeaturedPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPet = async () => {
      try {
        await handleTestSession();

        // **MODIFICACIÓN CLAVE AQUÍ:**
        // Asegúrate de que 'pets' siempre sea un array.
        // Si response.data no es un array o es null/undefined, usa un array vacío.
        const pets: Pet[] = await getPets();

        // Ahora 'pets' está garantizado de ser un array,
        // por lo que .find() y el acceso por índice son seguros.
        const availablePet = pets.find(
          (pet: Pet) => pet.pet_status === "available"
        );
        setFeaturedPet(availablePet || pets[0] || null); // Si no hay available, toma el primero; si no hay ninguno, null.
      } catch (error) {
        console.error("Error fetching featured pet:", error);
        setFeaturedPet(null); // Resetea el featuredPet en caso de error
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedPet();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sección Hero */}
      <section
        className="relative h-96 bg-cover bg-center rounded-b-lg shadow-xl"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1455526050980-d3e7b9b789a9)",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center">
          <div className="text-white px-4">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              Encuentra tu Compañero Perfecto en Paraguay
            </h1>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Dale una segunda oportunidad a una mascota que lo necesita.
              ¡Adopta y cambia una vida!
            </p>
            <Link
              to="/mascotas"
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faPaw} className="mr-2" /> Ver Mascotas
              Disponibles
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de Por Qué Adoptar */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            ¿Por Qué Adoptar una Mascota?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FontAwesomeIcon
                icon={faHeart}
                size="3x"
                className="text-red-500 mb-4"
              />
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Amor Incondicional
              </h3>
              <p className="text-gray-600">
                Las mascotas adoptadas ofrecen un cariño leal y una compañía
                inigualable.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FontAwesomeIcon
                icon={faPaw}
                size="3x"
                className="text-green-500 mb-4"
              />
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Una Segunda Oportunidad
              </h3>
              <p className="text-gray-600">
                Al adoptar, brindas un hogar seguro y feliz a un animal que lo
                necesita.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FontAwesomeIcon
                icon={faHome}
                size="3x"
                className="text-blue-500 mb-4"
              />
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Beneficios para la Salud
              </h3>
              <p className="text-gray-600">
                Tener una mascota puede reducir el estrés y mejorar tu bienestar
                general.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Mascota Destacada */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            ¡Conoce a Nuestra Mascota Destacada!
          </h2>
          {loading ? (
            <div className="text-gray-600">Cargando...</div>
          ) : featuredPet ? (
            <div className="max-w-md mx-auto">
              <MascotaDetalle pet={featuredPet} isPreview={true} />
            </div>
          ) : (
            <div className="text-gray-600">
              No hay mascotas disponibles en este momento.
            </div>
          )}
          <Link
            to="/mascotas"
            className="bg-green-600 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-full text-lg mt-10 inline-block transition-colors duration-300"
          >
            Ver Todas las Mascotas{" "}
            <FontAwesomeIcon icon={faPaw} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p className="text-sm">© 2025 Adopción de Mascotas Paraguay</p>
        <div className="mt-2">
          <Link
            to="/sobre-nosotros"
            className="text-gray-300 hover:text-white mx-4"
          >
            Sobre Nosotros
          </Link>
          <Link to="/contacto" className="text-gray-300 hover:text-white mx-4">
            Contacto
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
