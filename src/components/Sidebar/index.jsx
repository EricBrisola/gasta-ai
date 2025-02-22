/* eslint-disable react/prop-types */
const Sidebar = ({
  children,
  categories,
  cleanFilters,
  filterExpenses,
  handleChange,
}) => {
  return (
    <aside className="flex w-[12%] items-center">
      <article className="flex w-full flex-col justify-center gap-5 rounded-br-md rounded-tr-md bg-[#F7F6FA] py-5 text-black shadow-md">
        {children}
        <article className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">Categorias</p>
          <div className="flex flex-col items-start gap-2">
            {categories.map((category) => {
              return (
                <label
                  key={category.name}
                  htmlFor={category.value}
                  className="flex flex-row-reverse gap-1"
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
        <article className="flex justify-center gap-3">
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
    </aside>
  );
};
export default Sidebar;
