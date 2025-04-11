import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../API/firebase";
import { toaster } from "../../utils/toaster";

export const ChangePassword = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const { sucessToast, errorToast } = toaster();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      sucessToast(`Email de redefinição de senha enviado para ${email}`);
    } catch (error) {
      errorToast(
        `Erro ao tentar enviar o email de redefinição de senha: ${error}`,
      );
    } finally {
      setEmail("");
      closeModal();
    }
  };

  return (
    <section className="rounded-md bg-[#F7F6FA] shadow-lg">
      <article className="flex w-full justify-end pr-2 pt-2">
        <button
          type="button"
          className="h-8 w-8 cursor-pointer rounded border-none bg-red-600 pb-1 text-lg text-white"
          onClick={closeModal}
        >
          x
        </button>
      </article>
      <article className="flex w-80 items-center justify-center max-[320px]:w-72">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
          <label htmlFor="email-input" className="flex flex-col gap-4">
            <p className="text-lg font-semibold leading-none">Email</p>
            <input
              type="email"
              name="email"
              className="h-12 w-56 rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
              id="email-input"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              placeholder="email@email.com"
            />
          </label>
          <button className="rounded-md bg-[#645cff] p-2 text-white shadow-sm shadow-[#645cff]/20 duration-200 hover:shadow-lg hover:shadow-[#645cff]/40">
            Enviar
          </button>
        </form>
      </article>
    </section>
  );
};
