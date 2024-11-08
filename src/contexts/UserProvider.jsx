import { createContext, useEffect, useState } from "react";
import useRedirect from "../hooks/useRedirect";
import { auth, db } from "../API/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const redirectTo = useRedirect();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        getUserData(firebaseUser.uid); // Faz o fetch dos dados do usuário
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false); // Define `loading` como `false` após a verificação
    });

    return () => unsubscribe();
  }, []);

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
    const provider = new GoogleAuthProvider();
    try {
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
        redirectTo("/add-expense");
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      stopLoading();
    }
  };

  const signupUser = async (ev, startLoading, formData, stopLoading) => {
    ev.preventDefault();
    startLoading();

    try {
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
        loginUser(ev, startLoading, stopLoading, formData);
      }
    } catch (error) {
      alert(error.message);
      stopLoading();
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
        loading,
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
