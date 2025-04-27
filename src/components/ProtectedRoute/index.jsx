/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useRedirect from "../../hooks/useRedirect";
import { useUser } from "../../hooks/useUser";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const redirectTo = useRedirect();
  const { user, loading } = useUser(); // Usar o estado de `user` diretamente do contexto

  useEffect(() => {
    if (!loading && !user) {
      redirectTo("/login"); // Redireciona para a página de login apenas quando não está carregando e o usuário não está autenticado
    }
  }, [user, loading]);

  return user && children; // Renderiza o conteúdo protegido se o usuário estiver autenticado
};

export default ProtectedRoute;
