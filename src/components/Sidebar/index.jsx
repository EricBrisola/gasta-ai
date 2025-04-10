import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* eslint-disable react/prop-types */
const Sidebar = ({
  children,
  categories,
  cleanFilters,
  filterExpenses,
  handleChange,
  page,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <aside className="flex items-center">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-1/2 min-[426px]:hidden"
      >
        {!isSidebarOpen && <ArrowRight size={28} color="#645cff" />}
      </button>
      <article className="flex flex-col gap-5 rounded-br-md rounded-tr-md bg-[#F7F6FA] p-4 py-5 text-black shadow-md max-[425px]:hidden">
        {children}
        <article className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">Categorias</p>
          <div className="flex flex-col items-start gap-2">
            {categories.map((category) => {
              return (
                <label
                  key={category.name}
                  htmlFor={category.value}
                  className="flex flex-row-reverse items-center gap-1"
                >
                  {category.name}
                  <input
                    type="checkbox"
                    id={category.value}
                    className="filters"
                    checked={category.checked}
                    name={category.value}
                    onChange={handleChange}
                  />
                </label>
              );
            })}
          </div>
        </article>
        <article className="flex gap-3">
          <button
            className="rounded-md bg-red-800 px-3 py-1 text-white duration-200 hover:shadow-lg hover:shadow-red-800/40"
            onClick={cleanFilters}
          >
            Limpar
          </button>
          <button
            className="rounded-md bg-green-700 px-3 py-1 text-white duration-200 hover:shadow-lg hover:shadow-green-800/40"
            onClick={filterExpenses}
          >
            Filtrar
          </button>
        </article>
      </article>

      {/* {menu mobile para telas de 425px ou menos} */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.article
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed ${page} flex flex-row-reverse`}
          >
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="min-[426px]:hidden"
            >
              {isSidebarOpen && <ArrowLeft size={28} color="#645cff" />}
            </button>
            <article className="flex flex-col gap-5 rounded-br-md rounded-tr-md bg-[#F7F6FA] p-4 py-5 text-black shadow-md">
              {children}
              <article className="flex flex-col items-center gap-3">
                <p className="text-xl font-semibold">Categorias</p>
                <div className="flex flex-col items-start gap-2">
                  {categories.map((category) => {
                    return (
                      <label
                        key={category.name}
                        htmlFor={category.value}
                        className="flex flex-row-reverse items-center gap-1"
                      >
                        {category.name}
                        <input
                          type="checkbox"
                          id={category.value}
                          className="filters"
                          checked={category.checked}
                          name={category.value}
                          onChange={handleChange}
                        />
                      </label>
                    );
                  })}
                </div>
              </article>
              <article className="flex gap-3">
                <button
                  className="rounded-md bg-red-800 px-3 py-1 text-white duration-200 hover:shadow-lg hover:shadow-red-800/40"
                  onClick={cleanFilters}
                >
                  Limpar
                </button>
                <button
                  className="rounded-md bg-green-700 px-3 py-1 text-white duration-200 hover:shadow-lg hover:shadow-green-800/40"
                  onClick={filterExpenses}
                >
                  Filtrar
                </button>
              </article>
            </article>
          </motion.article>
        )}
      </AnimatePresence>
    </aside>
  );
};
export default Sidebar;
