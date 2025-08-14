import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Mantén Routes y Route si los necesitas en App.tsx por alguna razón, pero AuthWrapper los usará
import { Provider } from "react-redux";
import { store } from "./store/store";
import { getCsrfToken } from "./services/api"; // Para el CSRF inicial

// Importa el nuevo AuthWrapper
import AuthWrapper from "./components/AuthWrapper";

function App() {
  // Mueve la llamada a useAuth() fuera de aquí, a AuthWrapper.tsx
  // const { user, isLoading } = useAuth(); // ELIMINA ESTA LÍNEA

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        await getCsrfToken();
        console.log("CSRF token obtenido exitosamente.");
      } catch (error) {
        console.error("Falló la obtención del CSRF token:", error);
      }
    };
    fetchCsrf();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        {/* Renderiza el AuthWrapper dentro del Router */}
        <AuthWrapper />
      </Router>
    </Provider>
  );
}

export default App;
