import { createContext, useEffect, useState } from "react";
import useRedirect from "../hooks/useRedirect";
import { auth, db } from "../API/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const redirectTo = useRedirect();

  useEffect(() => {
    if (user) {
      getUserData(user?.uid);
      console.log(`Dados usuário: ${userData}`);
    }
  }, [user]);

  const getUserData = async (id) => {
    //id é o nome/id do documento que voce quer receber
    const docSnap = await getDoc(doc(db, "users", id));

    if (docSnap.exists()) {
      console.log(`Snapshot do usuario: ${docSnap.data()}`);
      setUserData(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No user found!");
    }
  };
  console.log(`userData: ${userData?.name}`);
  //parei aqui

  //Entrar com um usuario que ja existe email/senha
  const loginUser = async (ev, startLoading, stopLoading, formData) => {
    ev.preventDefault();

    try {
      startLoading();
      const newUser = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      setUser(newUser.user);
      console.log(`login com login:${user}`);

      if (newUser.user) {
        redirectTo("/add-expense");
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      stopLoading();
    }
  };

  const verifyIUD = async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    console.log(usersSnapshot.docs);
  };
  //verifyIUD();

  const loginWithGoogle = async (startLoading, stopLoading) => {
    //startLoading();
    //TODO: ver como fazer para usar com redirect
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Obtém o token de acesso do Google para acessar a API do Google
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      // Informações do usuário logado
      const user = result.user;
      console.log(`Login com google: ${result.user}`);
      if (user) {
        setUser(user);
        redirectTo("/add-expense");
      }
    } catch (error) {
      // Trate os erros aqui
      const errorCode = error.code;
      const errorMessage = error.message;
      stopLoading();
    }
  };

  const signupUser = async (ev, startLoading, formData, stopLoading) => {
    ev.preventDefault();
    //chama o loading aqui e no login pois se deixasse só o do login ele tem um delay estranho para fazer o loading, rever futuramente
    startLoading();

    try {
      if (formData.password != formData.passwordConfirm) {
        throw new Error("Confirme sua senha corretamente!");
      }

      if (formData.password.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres.");
      }

      const newUser = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const userUid = newUser.user.uid;

      const docData = {
        uid: userUid,
        email: formData.email,
        name: formData.name,
      };
      await setDoc(doc(db, "users", userUid), docData);
      if (newUser) {
        loginUser(ev, startLoading, stopLoading, formData);
      }
    } catch (error) {
      alert(error);
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      console.log("deslogou");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userData,
        setUser,
        loginUser,
        loginWithGoogle,
        signupUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
