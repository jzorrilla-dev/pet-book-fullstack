import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";

const SobreNosotros: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {/* Sección Hero Minimalista */}
      <section className="py-12 text-center bg-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Sobre Nosotros
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
          Somos una comunidad dedicada a encontrar hogares amorosos para
          mascotas en Paraguay.
        </p>
      </section>

      {/* Sección Misión y Visión Minimalista */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Nuestra Misión
            </h2>
            <p className="text-gray-600 leading-relaxed">
              En Adopción de Mascotas Paraguay, nuestra misión es conectar a
              animales necesitados con familias amorosas. Creemos que cada
              mascota merece un hogar seguro y lleno de cariño. Trabajamos con
              refugios locales, voluntarios y amantes de los animales para
              promover la adopción responsable y reducir el abandono.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Nuestra Visión
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Soñamos con un Paraguay donde ningún animal viva en la calle. A
              través de la educación, la adopción y la colaboración con
              comunidades locales, buscamos crear un futuro donde todas las
              mascotas tengan un lugar al que llamar hogar.
            </p>
          </div>
        </div>
      </section>

      {/* Sección Llamado a la Acción Minimalista */}
      <section className="py-8 bg-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Únete a Nuestra Causa
        </h2>
        <p className="text-gray-600 mb-4 max-w-xl mx-auto">
          ¿Querés ser parte del cambio? Adopta, dona o comparte nuestra misión
          para ayudar a más mascotas a encontrar un hogar.
        </p>
        <Link
          to="/mascotas"
          className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-full text-lg transition-colors duration-300 inline-block"
        >
          <FontAwesomeIcon icon={faPaw} className="mr-2" /> Ver Mascotas
        </Link>
      </section>

      {/* Footer Minimalista */}
      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
        <p>© 2025 Adopción de Mascotas Paraguay</p>
        <div className="mt-2">
          <Link
            to="/sobre-nosotros"
            className="text-gray-300 hover:text-white mx-2"
          >
            Sobre Nosotros
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/contacto" className="text-gray-300 hover:text-white mx-2">
            Contacto
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default SobreNosotros;
