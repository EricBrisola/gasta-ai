import { useEffect } from "react";
import useRedirect from "../../hooks/useRedirect";
import { auth } from "../../API/firebase";
import { useUser } from "../../hooks/useUser";

const ProtectedRoute = ({ children }) => {
  const redirectTo = useRedirect();
  const { setUser } = useUser();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setUser(null);
        redirectTo("/");
      }
    });
    return () => unsubscribe();
  }, []);

  return children; // Renderiza o conteúdo protegido se o usuário estiver autenticado
};

export default ProtectedRoute;
