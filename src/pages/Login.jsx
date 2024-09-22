import { useState } from "react";
import GoogleLoginImage from "../assets/google-login-image.png";
import supabase from "../API/client";
import useRedirect from "../hooks/useRedirect";
import { useLoading } from "../hooks/useLoading";
import loadingAnimation from "../assets/loading_animation.json";
import Modal from "../components/Modal";
import Animation from "../components/Animation";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoading, startLoading, stopLoading } = useLoading();

  const redirectTo = useRedirect();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      startLoading();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Login error:", error); // Adicionar log de erro
        alert("Erro ao fazer login: " + error.message);
      }
      console.log(data);
      setFormData({
        email: "",
        password: "",
      });
      if (data) stopLoading();
      //await sucessfulLoginRedirect();
    } catch (error) {
      alert(error);
    } finally {
      stopLoading();
    }
  };

  const handleChange = (ev) => {
    setFormData({
      ...formData,
      [ev.target.name]: ev.target.value,
    });
  };

  const SignInWithGoogle = () => {};

  const redirectToSignUpPage = () => {
    redirectTo("/sign-up");
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-[#E2DEE9] text-[#102a42]">
      <section className="flex w-80 flex-col items-center justify-center rounded-md bg-[#F7F6FA] shadow-lg">
        <p className="w-56 pt-6 text-3xl font-semibold leading-none">Login</p>
        <form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit}>
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
              className="h-12 w-56 rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
              id="password-input"
              placeholder="Senha"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <button className="text-left text-sm font-bold text-[#645cff]">
            Esqueceu a senha ?
          </button>
          <button className="rounded-md bg-[#645cff] p-2 text-white shadow-sm shadow-[#645cff]/20 duration-200 hover:shadow-lg hover:shadow-[#645cff]/40">
            Conectar
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
            <p className="leading-none">Conecte-se com Google</p>
          </article>
        </form>
        <article className="flex gap-1 pb-6">
          <p>Novo por aqui ? </p>
          <button
            className="text-left font-bold text-[#645cff]"
            onClick={redirectToSignUpPage}
          >
            Crie uma conta
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
