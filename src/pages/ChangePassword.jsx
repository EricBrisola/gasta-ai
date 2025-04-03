import { useState } from "react";

export const ChangePassword = () => {
  const [email, setEmail] = useState({
    userEmail: "",
  });

  const handleSubmit = () => {};

  const handleExpenseInputs = () => {};

  return (
    <main className="flex h-screen flex-1 items-center justify-center bg-[#E2DEE9] text-[#102a42]">
      <article className="flex w-80 items-center justify-center rounded-md bg-[#F7F6FA] shadow-lg max-[320px]:w-72">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
          <label
            htmlFor="new-expense-title-input"
            className="flex flex-col gap-4"
          >
            <p className="text-lg font-semibold leading-none">Email</p>
            <input
              type="text"
              name="title"
              className="h-12 w-56 rounded-md border-[1px] border-[#645cff] bg-transparent p-3 outline-none focus:border-2"
              id="new-expense-title-input"
              value={email.userEmail}
              onChange={handleExpenseInputs}
              required
              placeholder="email@email.com"
            />
          </label>
          {/* <label
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
        </label> */}
          <button className="rounded-md bg-[#645cff] p-2 text-white shadow-sm shadow-[#645cff]/20 duration-200 hover:shadow-lg hover:shadow-[#645cff]/40">
            Redefinir
          </button>
        </form>
      </article>
    </main>
  );
};
