/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs";
import ExpenseCard from "../components/ExpenseCard";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../API/firebase";
import { useUser } from "../hooks/useUser";
import { useLoading } from "../hooks/useLoading";
import Modal from "../components/Modal";
import Animation from "../components/Animation";
import loadingAnimation from "../assets/loading_animation.json";
import categoriesImgHashMap from "../assets/categoriesImgsHashMap";

export const Today = () => {
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { userData } = useUser();

  useEffect(() => {
    if (userData?.uid) getDailyExpenses();
  }, [userData]);

  useEffect(() => {
    getDailyTotal();
  }, [dailyExpenses]);

  const getDailyTotal = () => {
    const dailyTotalValue =
      dailyExpenses.length > 0
        ? dailyExpenses.reduce((acc, item) => {
            return (acc += +item.value);
          }, 0)
        : 0;

    setDailyTotal(dailyTotalValue);
  };

  const getDailyExpenses = async () => {
    try {
      startLoading();
      const expenseCollection = collection(
        db,
        "users",
        userData?.uid,
        "expenses",
      );

      // Filtrar documentos pelo campo de identificação do usuário
      const q = query(
        expenseCollection,
        where("date", "==", dayjs().format("YYYY-MM-DD")),
      );

      // Buscar os documentos
      const querySnapshot = await getDocs(q);
      if (querySnapshot) stopLoading();

      querySnapshot.forEach((doc) => {
        setDailyExpenses((prev) => [...prev, { id: doc?.id, ...doc?.data() }]);
      });
    } catch (error) {
      alert(`Erro: ${error}`);
    } finally {
      stopLoading();
    }
  };

  const deleteExpense = async (id, title) => {
    try {
      await deleteDoc(doc(db, "users", userData.uid, "expenses", id));
      //await getDailyExpenses();
      //TODO: implementar um jeito de recarregar a pagina e ver pq toda vez q recarrega, os gastos duplicam
    } catch (error) {
      alert(`Erro: ${error}\n Ao excluir o gasto: ${title}`);
    }
  };

  console.log(dailyExpenses);

  return (
    <main className="flex h-screen flex-col bg-[#E2DEE9]">
      <Navbar />
      <section className="flex flex-1">
        <Sidebar />
        <section className="flex flex-1 flex-col gap-3">
          <Header total={dailyTotal} date={dayjs().format("DD/MM/YYYY")} />
          <article className="flex justify-center pb-7">
            <div className="flex w-full flex-wrap gap-6 px-9">
              {isLoading ? (
                <Modal>
                  <Animation animation={loadingAnimation} />
                </Modal>
              ) : dailyExpenses.length >= 1 ? (
                dailyExpenses.map((expense) => {
                  return (
                    <ExpenseCard
                      key={expense.id}
                      id={expense.id}
                      title={expense.title}
                      value={expense.value}
                      categoryImg={categoriesImgHashMap[expense.category]}
                      deleteExpense={() =>
                        deleteExpense(expense.id, expense.title)
                      }
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
