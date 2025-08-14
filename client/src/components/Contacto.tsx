import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", message: "" };

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
      valid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Aquí puedes integrar con tu API Laravel
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sección Hero */}
      <section
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1518717758536-85ae29035b6d)",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              ¿Tenés preguntas o querés colaborar? ¡Estamos aquí para ayudarte!
            </p>
          </div>
        </div>
      </section>

      {/* Sección Contacto */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Formulario */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Envíanos un Mensaje
              </h2>
              {submitted && (
                <p className="text-green-600 mb-4">
                  ¡Mensaje enviado con éxito! Te responderemos pronto.
                </p>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-full w-full transition-colors duration-300"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
            {/* Información de Contacto */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Información de Contacto
              </h2>
              <p className="text-gray-600 mb-4">
                Estamos aquí para responder tus preguntas y colaborar en la
                adopción de mascotas.
              </p>
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-blue-600 mr-3"
                />
                <a
                  href="mailto:info@adopcionparaguay.com"
                  className="text-gray-700 hover:text-blue-600"
                >
                  info@adopcionparaguay.com
                </a>
              </div>
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-blue-600 mr-3"
                />
                <a
                  href="tel:+595123456789"
                  className="text-gray-700 hover:text-blue-600"
                >
                  +595 123 456 789
                </a>
              </div>
              <div className="mt-6">
                <p className="text-gray-600 mb-2">
                  Seguinos en redes sociales:
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={["fab", "facebook"]} size="2x" />
                  </a>
                  <a
                    href="https://instagram.com"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={["fab", "instagram"]} size="2x" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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

export default Contacto;
