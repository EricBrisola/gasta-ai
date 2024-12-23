/* eslint-disable react/prop-types */
const EditForm = ({
  categories,
  maxDate,
  handleExpenseInputs,
  handleExpenseValueChange,
  expenseValue,
  expense: { title, date, category },
  updateExpense,
}) => {
  return (
    <form className="flex flex-col gap-6 px-2 py-1 text-black">
      <section className="flex flex-row flex-wrap gap-4">
        <article className="space-y-4">
          <label
            htmlFor="new-expense-title-input"
            className="flex flex-col gap-4"
          >
            <p className="text-lg font-semibold leading-none">Gasto</p>
            <input
              type="text"
              name="title"
              className="h-12 w-56 rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
              id="new-expense-title-input"
              value={title}
              onChange={handleExpenseInputs}
              required
            />
          </label>
          <label
            htmlFor="new-expense-value-input"
            className="flex flex-col gap-4"
          >
            <p className="text-lg font-semibold leading-none">Valor</p>
            <input
              type="text"
              name="value"
              className="h-12 w-56 rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
              id="new-expense-value-input"
              value={expenseValue}
              onChange={handleExpenseValueChange}
              required
            />
          </label>
        </article>
        <article className="space-y-4">
          <label
            htmlFor="new-expense-category-input"
            className="flex flex-col gap-4"
          >
            <p className="text-lg font-semibold leading-none">Categoria</p>
            <select
              name="category"
              className="h-12 w-56 rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
              id="new-expense-category-input"
              value={category}
              onChange={handleExpenseInputs}
              required
            >
              {categories.map((category) => {
                return (
                  <option value={category.value} key={category.value}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </label>
          <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold leading-none">Data</p>
            <input
              id="new-expense-date-input"
              type="date"
              name="date"
              className="h-12 w-56 rounded border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
              onChange={handleExpenseInputs}
              value={date}
              max={maxDate}
            />
          </div>
        </article>
      </section>
      <button
        className="rounded-md bg-[#645cff] p-2 text-white shadow-sm shadow-[#645cff]/20 duration-200 hover:shadow-lg hover:shadow-[#645cff]/40"
        onClick={updateExpense}
      >
        Salvar
      </button>
    </form>
  );
};
export default EditForm;
