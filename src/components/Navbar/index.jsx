import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import NavbarBtn from "../NavbarBtn";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { userData, logoutUser } = useUser();

  const navButtonStyle =
    "text-white text-base flex flex-2 items-center tracking-wide hover:bg-[#cfe8ff] duration-200 p-2 rounded-md hover:text-[#617d98] max-[425px]:rounded-none max-[425px]:justify-center max-[425px]:bg-[#5148cc] max-[425px]:rounded-md";

  const userNameStyle =
    "text-white text-base flex flex-2 items-center tracking-wide p-2 rounded-md max-[425px]:self-center max-[425px]:text-lg";

  return (
    <nav className="flex w-full bg-[#645cff] px-6 py-1 max-[425px]:fixed max-[425px]:justify-between">
      <NavbarBtn
        textContent={"Gasta ai"}
        path={"/add-expense"}
        style={
          "text-white text-2xl flex flex-1 tracking-wide items-center max-lg:flex-none"
        }
      />

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="pt-1 min-[426px]:hidden"
      >
        {isMenuOpen ? (
          <X size={28} color="#fff" />
        ) : (
          <Menu size={28} color="#fff" />
        )}
      </button>

      <article className="flex flex-1 justify-center gap-6 max-md:gap-3 max-[425px]:hidden">
        <NavbarBtn
          textContent={"Hoje"}
          path={"/today"}
          style={navButtonStyle}
        />
        <NavbarBtn
          textContent={"Semana"}
          path={"/last-week"}
          style={navButtonStyle}
        />
        <NavbarBtn
          textContent={"Mês"}
          path={"/last-month"}
          style={navButtonStyle}
        />
        <NavbarBtn
          textContent={"Todos gastos"}
          path={"/all-expenses"}
          style={navButtonStyle}
        />
      </article>
      <article className="flex flex-1 justify-end max-lg:flex-none max-[425px]:hidden">
        <p className={userNameStyle}>
          {userData?.name[0].toUpperCase() +
            userData?.name.slice(1, userData?.name.length) || "Carregando..."}
        </p>
        <button className={navButtonStyle} onClick={logoutUser}>
          Desconectar
        </button>
      </article>

      {/* {componente hamburguer para mobile} */}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.article
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute right-0 top-10 flex w-2/4 flex-col gap-2 rounded-bl-md bg-[#645cff] p-4 text-white shadow-lg"
          >
            <p className={userNameStyle}>
              {userData?.name[0].toUpperCase() +
                userData?.name.slice(1, userData?.name.length) ||
                "Carregando..."}
            </p>
            <NavbarBtn
              textContent="Hoje"
              path="/today"
              style={navButtonStyle}
            />
            <NavbarBtn
              textContent="Semana"
              path="/last-week"
              style={navButtonStyle}
            />
            <NavbarBtn
              textContent="Mês"
              path="/last-month"
              style={navButtonStyle}
            />
            <NavbarBtn
              textContent="Todos gastos"
              path="/all-expenses"
              style={navButtonStyle}
            />
            <button className={navButtonStyle} onClick={logoutUser}>
              Desconectar
            </button>
          </motion.article>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
