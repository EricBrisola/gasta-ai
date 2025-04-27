import { createContext, useEffect, useState } from "react";
import useRedirect from "../hooks/useRedirect";
import { auth, db } from "../API/firebase";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toaster } from "../utils/toaster";

export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const redirectTo = useRedirect();
  const { errorToast } = toaster();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await getUserData(firebaseUser.uid); // Faz o fetch dos dados do usuário
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false); // Define `loading` como `false` após a verificação
    });

    return () => unsubscribe();
  }, []);

  const getUserData = async (id) => {
    //id é o nome/id do documento que voce quer receber
    const docSnap = await getDoc(doc(db, "users", id));

    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      errorToast("Usuário não encontrado");
    }
  };

  //Entrar com um usuario que ja existe email/senha
  const loginUser = async (ev, startLoading, stopLoading, formData) => {
    ev.preventDefault();

    try {
      startLoading();
      await setPersistence(auth, browserLocalPersistence);
      const newUser = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      setUser(newUser.user);
      if (newUser.user) {
        redirectTo("/");
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      errorToast(`Erro: ${errorCode}\n${errorMessage}`);
    } finally {
      stopLoading();
    }
  };

  const loginWithGoogle = async (startLoading, stopLoading) => {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        // Verifica se o usuário já existe no Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
          // Cria o documento do usuário no Firestore
          const docData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
          };
          await setDoc(userDocRef, docData);
        }

        // Atualiza o estado do usuário e redireciona
        setUser(user);
        redirectTo("/");
      }
    } catch (error) {
      errorToast(`Erro: ${error.message}`);
    } finally {
      stopLoading();
    }
  };

  const signupUser = async (ev, startLoading, formData, stopLoading) => {
    ev.preventDefault();

    try {
      startLoading();
      if (formData.password !== formData.passwordConfirm) {
        throw new Error("Confirme sua senha corretamente!");
      }

      if (formData.password.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres.");
      }

      // Verifica se o usuário já existe no Firestore pelo email
      const userDocRef = doc(db, "users", formData.email);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        throw new Error("Esse usuário já está cadastrado.");
      }

      // Cria a conta de autenticação
      const newUser = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const userUid = newUser.user.uid;

      // Cria o documento do usuário no Firestore
      const docData = {
        uid: userUid,
        email: formData.email,
        name: formData.name,
      };
      await setDoc(doc(db, "users", userUid), docData);

      if (newUser) {
        redirectTo("/");
        //loginUser(ev, startLoading, stopLoading, formData);
      }
    } catch (error) {
      errorToast(error.message);
    } finally {
      stopLoading();
    }
  };

  const logoutUser = async () => {
    try {
      setUser(null);
      await signOut(auth);
    } catch (error) {
      errorToast(`Erro ao deslogar: ${error}`);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userData,
        loading,
        setUser,
        getUserData,
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
