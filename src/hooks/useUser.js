import { useContext } from "react"
import { UserContext } from "../contexts/UserProvider";


export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("Usuário não está autenticado")
    }
    return context
}
