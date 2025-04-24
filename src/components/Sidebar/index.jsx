import { useState } from "react";
import { Filter, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* eslint-disable react/prop-types */
const Sidebar = ({
  children,
  categories,
  cleanFilters,
  filterExpenses,
  handleChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <aside className="flex items-center">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-1/2 -translate-y-1/2 min-[430px]:hidden"
      >
        {!isSidebarOpen && (
          <Filter
            size={40}
            className="rounded-br-md rounded-tr-md border-b-2 border-r-2 border-t-2 border-[#645cff] bg-[#E2DEE9] p-1 text-[#645cff]"
          />
        )}
      </button>
      <article className="flex flex-col gap-5 rounded-br-md rounded-tr-md bg-[#F7F6FA] p-4 py-5 text-black shadow-md max-[430px]:hidden">
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

      {/* {menu mobile para telas de 430px ou menos} */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.article
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-start min-[430px]:hidden"
          >
            <div className="flex flex-row-reverse">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="min-[430px]:hidden"
              >
                <ArrowLeft
                  size={40}
                  className="rounded-br-md rounded-tr-md bg-[#F7F6FA] text-[#5148cc]"
                />
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
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </aside>
  );
};
export default Sidebar;
