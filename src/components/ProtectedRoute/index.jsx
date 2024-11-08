/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useRedirect from "../../hooks/useRedirect";
import { useUser } from "../../hooks/useUser";
import Modal from "../Modal";
import Animation from "../Animation";
import loadingAnimation from "../../assets/loading_animation.json";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const redirectTo = useRedirect();
  const { user, loading } = useUser(); // Usar o estado de `user` diretamente do contexto

  useEffect(() => {
    if (!loading && !user) {
      redirectTo("/"); // Redireciona para a página de login apenas quando não está carregando e o usuário não está autenticado
    }
  }, [user, loading]);

  if (loading)
    return (
      <Modal>
        <Animation animation={loadingAnimation} />
      </Modal>
    ); // Mostra uma tela de carregamento enquanto verifica a autenticação

  return user && children; // Renderiza o conteúdo protegido se o usuário estiver autenticado
};

export default ProtectedRoute;
