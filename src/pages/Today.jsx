import dayjs from "dayjs";
import ExpenseCard from "../components/ExpenseCard";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export const Today = () => {
  const dailyTotal = 0;
  const dailyExpenses = [];
  const deleteExpense = () => {};
  const categoriesImgHashMap = {};
  return (
    <main className="flex h-screen flex-col bg-[#E2DEE9]">
      <Navbar />
      <section className="flex flex-1">
        <Sidebar />
        <section className="flex flex-1 flex-col gap-3">
          <Header total={dailyTotal} date={dayjs().format("DD/MM/YYYY")} />
          <article className="flex justify-center pb-7">
            <div className="flex w-full flex-wrap gap-6 px-9">
              {dailyExpenses.length >= 1 ? (
                dailyExpenses.map((expense) => {
                  return (
                    <ExpenseCard
                      key={expense.id}
                      id={expense.id}
                      title={expense.title}
                      value={expense.value}
                      categoryImg={categoriesImgHashMap[expense.category]}
                      deleteExpense={() => deleteExpense(expense.id)}
                    />
                  );
                })
              ) : (
                <p className="flex w-full justify-center text-2xl font-normal text-[#102a42]">
                  Sem gastos registrados hoje
                </p>
              )}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
};
