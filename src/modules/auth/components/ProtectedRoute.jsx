import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../hook/useAuth";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Acceso Restringido",
        text: "Para acceder a esta sección necesitas permisos de administrador.",
        icon: "warning",
        showCancelButton: true, // Habilita el segundo botón
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ir a Login", // Botón de Aceptar
        cancelButtonText: "Cancelar", // Botón de Cancelar
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // Si presiona "Ir a Login"
          navigate("/login");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Si presiona "Cancelar", regresa al inicio
          navigate("/");
        }
      });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
