import { useState } from "react";
import GoogleLoginImage from "../assets/google-login-image.png";
import supabase from "../API/client";
import useRedirect from "../hooks/useRedirect";
import { useLoading } from "../hooks/useLoading";
import loadingAnimation from "../assets/loading_animation.json";
import Modal from "../components/Modal";
import Animation from "../components/Animation";

export const SignUp = () => {
  //TODO: ver a parte de como colocar a sessao do usuario global
  //TODO: arrumar a url de redirecionamento dps que confirma criacao de conta no email

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const { isLoading, startLoading, stopLoading } = useLoading();

  const redirectTo = useRedirect();

  const redirectToLoginPage = () => {
    redirectTo("/");
  };

  const handleChange = (ev) => {
    setFormData({
      ...formData,
      [ev.target.name]: ev.target.value,
    });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      if (formData.password != formData.passwordConfirm) {
        throw new Error("Confirme sua senha corretamente!");
      }

      if (formData.password.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres.");
      }

      startLoading();

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) throw new Error(error);

      alert(
        "Conta criada com sucesso! Cheque seu email e acesse o link de verficação.",
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
      });
      if (data) {
        stopLoading();
        redirectTo("/add-expense");
      }

      // await redirectToFormPage();
    } catch (error) {
      alert(`${error}`);
    } finally {
      stopLoading();
    }
  };

  const SignInWithGoogle = async () => {
    try {
      startLoading();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173/add-expense", // URL de callback
        },
      });
      console.log(data);
      if (data) stopLoading();

      if (error) {
        console.error("Login error:", error); // Adicionar log de erro
        alert("Erro ao fazer login: " + error.message);
      }
      //TODO: verificar a necessidade desse if e talvez trocar por um throw new error
    } catch (error) {
      alert("Erro ao tentar conectar com google");
    } finally {
      stopLoading();
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-[#E2DEE9] text-[#102a42]">
      <section className="flex w-80 flex-col items-center justify-center rounded-md bg-[#F7F6FA] shadow-lg">
        <p className="w-56 pt-6 text-3xl font-semibold leading-none">
          Cadastro
        </p>
        <form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit}>
          <label htmlFor="name-input">
            <input
              type="text"
              name="name"
              className="h-12 w-56 rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
              id="name-input"
              placeholder="Nome"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="email-input">
            <input
              type="email"
              name="email"
              className="h-12 w-56 rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
              id="email-input"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="password-input">
            <input
              type="password"
              name="password"
              className={`h-12 ${"w-56"} rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2`}
              id="password-input"
              placeholder="Senha"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="password-confirm">
            <input
              type="password"
              name="passwordConfirm"
              className={`h-12 ${"w-56"} rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2`}
              id="password-confirm"
              placeholder="Confirmar senha"
              required
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
          </label>
          <button className="rounded-md bg-[#645cff] p-2 text-white shadow-sm shadow-[#645cff]/20 duration-200 hover:shadow-lg hover:shadow-[#645cff]/40">
            Cadastrar
          </button>
          <article className="flex items-center justify-center gap-2">
            <hr className="border-t-1 mt-1 flex-1 border-[#a2a2a3]" />
            <p className="text-center">ou</p>
            <hr className="border-t-1 mt-1 flex-1 border-[#a2a2a3]" />
          </article>
          <article
            className="flex cursor-pointer items-center justify-center gap-3 rounded-full border-[1px] border-[#645cff] p-3 shadow-md duration-200 hover:shadow-lg hover:shadow-[#645cff]/40"
            onClick={SignInWithGoogle}
          >
            <img
              src={GoogleLoginImage}
              alt="google-login-image"
              className="h-5 w-5"
            />
            <p className="leading-none">Entre com Google</p>
          </article>
        </form>
        <article className="flex gap-1 pb-6">
          <p>Já possui uma conta ? </p>
          <button
            className="text-left font-bold text-[#645cff]"
            onClick={redirectToLoginPage}
          >
            Entre aqui
          </button>
        </article>
      </section>
      {isLoading && (
        <Modal>
          <Animation animation={loadingAnimation} />
        </Modal>
      )}
    </main>
  );
};
