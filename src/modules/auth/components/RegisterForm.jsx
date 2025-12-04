import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { registerUser } from "../services/register";

function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onValid = async (formData) => {
    setErrorMessage("");

    const { error } = await registerUser(
      formData.username,
      formData.email,
      formData.password
    );

    if (error) {
      // Lógica mejorada para leer el error del backend

      // 1. Caso: Lista de errores (ej: Identity errors como "Username taken")
      if (
        error.errors &&
        Array.isArray(error.errors) &&
        error.errors.length > 0
      ) {
        setErrorMessage(error.errors[0]); // Mostramos el primer error de la lista
        // Si quisieras mostrarlos todos: setErrorMessage(error.errors.join('. '));
      }
      // 2. Caso: Detalle específico (ProblemDetails)
      else if (error.detail) {
        setErrorMessage(error.detail);
      }
      // 3. Caso: Mensaje genérico del backend
      else if (error.message) {
        setErrorMessage(error.message);
      }
      // 4. Fallback por si no viene nada
      else {
        setErrorMessage("Error desconocido al registrar. Intente nuevamente.");
      }
      return;
    }

    // Éxito: SweetAlert
    Swal.fire({
      title: "¡Cuenta Creada!",
      text: "Tu registro ha sido exitoso. Por favor inicia sesión.",
      icon: "success",
      confirmButtonText: "Ir a Iniciar Sesión",
      allowOutsideClick: false,
    }).then(() => {
      navigate("/login");
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
      <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>

      <Input
        label="Usuario"
        {...register("username", {
          required: "Usuario es obligatorio",
          minLength: { value: 3, message: "Mínimo 3 caracteres" },
        })}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        {...register("email", {
          required: "Email es obligatorio",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Formato de email inválido",
          },
        })}
        type="email"
        error={errors.email?.message}
      />

      <Input
        label="Contraseña"
        {...register("password", {
          required: "Contraseña es obligatoria",
          minLength: { value: 8, message: "Mínimo 8 caracteres" },
        })}
        type="password"
        error={errors.password?.message}
      />

      <Input
        label="Confirmar contraseña"
        {...register("confirmPassword", {
          required: "Confirmar contraseña es obligatorio",
          validate: (value) =>
            value === password || "Las contraseñas no coinciden",
        })}
        type="password"
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registrando..." : "Registrar Usuario"}
      </Button>

      <Button
        variant="secondary"
        onClick={() => navigate("/login")}
        type="button"
      >
        Ya tengo cuenta
      </Button>

      {errorMessage && (
        <p className="text-red-500 text-center font-medium mt-2">
          {errorMessage}
        </p>
      )}
    </form>
  );
}

export default RegisterForm;
