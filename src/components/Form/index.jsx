import dayjs from "dayjs";
import { useState } from "react";

const Form = () => {
  const [expense, setExpense] = useState({
    title: "",
    value: "",
    category: "",
    date: "",
  });
  const handleSubmit = () => {};

  const handleExpenseInputs = () => {};

  const handleExpenseValueChange = () => {};

  const expenseValue = 0;

  const categories = [
    {
      name: "Alimentação",
      value: "food",
    },
    {
      name: "Transporte",
      value: "transport",
    },
    {
      name: "Entretenimento",
      value: "enterteinment",
    },
    {
      name: "Moradia",
      value: "home",
    },
    {
      name: "Saúde",
      value: "health",
    },
    {
      name: "Diversos",
      value: "miscellaneous",
    },
  ];

  return (
    <article className="flex w-80 items-center justify-center rounded-md bg-[#F7F6FA] shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
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
            value={expense.title}
            onChange={handleExpenseInputs}
            required
            placeholder="Mercado"
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
        <label
          htmlFor="new-expense-category-input"
          className="flex flex-col gap-4"
        >
          <p className="text-lg font-semibold leading-none">Categoria</p>
          <select
            name="category"
            className="h-12 w-56 rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
            id="new-expense-category-input"
            value={expense.category}
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
            value={expense.date}
            max={dayjs().format("YYYY-MM-DD")}
          />
        </div>
        <button className="rounded-md bg-[#645cff] p-2 text-white shadow-sm shadow-[#645cff]/20 duration-200 hover:shadow-lg hover:shadow-[#645cff]/40">
          Adicionar
        </button>
      </form>
    </article>
  );
};

export default Form;
