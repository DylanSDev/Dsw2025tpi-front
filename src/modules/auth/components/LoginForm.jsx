import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import useAuth from "../hook/useAuth";
import { frontendErrorMessage } from "../helpers/backendError";

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const navigate = useNavigate();
  const { singin } = useAuth();

  const onValid = async (formData) => {
    setErrorMessage("");

    const { error, user } = await singin(formData.email, formData.password);

    if (error) {
      if (error.code && frontendErrorMessage[error.code]) {
        setErrorMessage(frontendErrorMessage[error.code]);
      } else if (error.message || error.detail) {
        setErrorMessage(error.message || error.detail);
      } else {
        setErrorMessage(
          "Ocurrió un error al iniciar sesión. Intente nuevamente."
        );
      }
      return;
    }

    // 2. Login Exitoso: Mostramos la alerta
    Swal.fire({
      title: "¡Bienvenido!",
      text: "Inicio de sesión exitoso",
      icon: "success",
      timer: 1500, // Se cierra solo a los 1.5 segundos
      showConfirmButton: false,
      allowOutsideClick: false,
    }).then(() => {
      // 3. Redirigimos DESPUÉS de que cierra la alerta
      if (user.role === "admin") {
        navigate("/admin/home");
      } else {
        navigate("/");
      }
    });
  };

  return (
    <form
      className="
        flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      "
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label="Email"
        {...register("email", {
          required: "Email es obligatorio",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "El formato del email no es válido",
          },
        })}
        error={errors.email?.message}
      />

      <Input
        label="Contraseña"
        {...register("password", {
          required: "Contraseña es obligatoria",
          minLength: {
            value: 8,
            message: "La contraseña debe tener al menos 8 caracteres",
          },
        })}
        type="password"
        error={errors.password?.message}
      />

      <Button type="submit">Iniciar Sesión</Button>
      <Button variant="secondary" onClick={() => navigate("/signup")}>
        Registrar Usuario
      </Button>

      {errorMessage && (
        <p className="text-red-500 text-center font-medium">{errorMessage}</p>
      )}
    </form>
  );
}

export default LoginForm;
