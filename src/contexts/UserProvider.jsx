import { createContext, useState, useEffect } from "react";
import useRedirect from "../hooks/useRedirect";
import supabase from "../API/client";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const redirectTo = useRedirect();

  const saveUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
      }
      console.log(user);
    } catch (error) {
      alert(`Erro: ${error}`);
    }
  };

  const loginUser = async (
    ev,
    startLoading,
    stopLoading,
    setFormData,
    email,
    password,
  ) => {
    ev.preventDefault();
    try {
      startLoading();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error); // Adicionar log de erro
        alert("Erro ao fazer login: " + error.message);
        stopLoading();
      }
      console.log(data);
      setFormData({
        email: "",
        password: "",
      });

      if (data) {
        await saveUser();
        redirectTo("/add-expense");
      }
    } catch (error) {
      alert(error);
    }
  };

  const loginWithGoogle = async (startLoading, stopLoading) => {
    try {
      startLoading();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173/add-expense",
        },
      });
      console.log(data);

      if (data) await saveUser();

      if (error) {
        console.error("Login error:", error); // Adicionar log de erro
        alert("Erro ao fazer login: " + error.message);
        stopLoading();
      }
      //TODO: verificar a necessidade desse if e talvez trocar por um throw new error
    } catch (error) {
      alert("Erro ao tentar conectar com google");
    }
  };

  const signupUser = async (
    ev,
    startLoading,
    email,
    password,
    passwordConfirm,
    name,
    setFormData,
  ) => {
    ev.preventDefault();
    try {
      if (password != passwordConfirm) {
        throw new Error("Confirme sua senha corretamente!");
      }

      if (password.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres.");
      }

      startLoading();

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw new Error(error);

      alert(
        "Conta criada com sucesso! Cheque seu email e acesse o link de verificação.",
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
      });
      if (data) {
        await saveUser();
        redirectTo("/add-expense");
      }
    } catch (error) {
      alert(`${error}`);
    }
  };

  const checkUserSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      if (data.session) {
        setUser(data.session.user);
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
    }
  };

  const logoutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      if (error) throw new Error();
    } catch (error) {
      alert(`Erro: ${error}`);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loginUser, loginWithGoogle, signupUser, logoutUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
