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
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../API/firebase";
import { useUser } from "../hooks/useUser";
import { useLoading } from "../hooks/useLoading";
import Modal from "../components/Modal";
import Animation from "../components/Animation";
import loadingAnimation from "../assets/loading_animation.json";
import categoriesImgHashMap from "../assets/categoriesImgsHashMap";
import EditForm from "../components/UpdateForm";
import useModal from "../hooks/useModal";
import { categories } from "../utils/categories";

export const LastWeek = () => {
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [editedExpense, setEditedExpense] = useState({
    title: "",
    value: "",
    category: "",
    date: "",
  });
  const [expenseValue, setExpenseValue] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { userData } = useUser();
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    if (userData?.uid) getDailyExpenses();
  }, [userData]);

  //usado para atualizar os valores totais dos gastos diarios
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
        where("date", ">", dayjs().isAfter(dayjs().startOf("week")) == true),
      );
      console.log(dayjs().startOf("week"));

      // Buscar os documentos
      const querySnapshot = await getDocs(q);
      if (querySnapshot) stopLoading();

      setDailyExpenses(() => {
        const newExpenses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return newExpenses;
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
      await getDailyExpenses();
    } catch (error) {
      alert(`Erro: ${error}\n Ao excluir o gasto: ${title}`);
    }
  };

  const setCurrentExpense = (currentExpense) => {
    // seta o gasto que quer alterar dentro dos inputs do modal
    setEditedExpense(currentExpense);
    // seta o valor do gasto que quer alterar para o valor dentro do modal
    // tambem troca o ponto do valor para vírgula com intuito de ficar no sistema numerico br
    setExpenseValue(currentExpense.value.replace(".", ","));
  };

  const handleExpenseInputs = (ev) => {
    setEditedExpense({
      ...editedExpense,
      [ev.target.name]: ev.target.value,
    });
  };

  const submitUpdatedExpense = async (ev) => {
    ev.preventDefault();
    //troca de vírgula para ponto para quando salvar nao resultar em NaN
    const expenseWithValueFixed = {
      title: editedExpense.title,
      value: expenseValue.replace(",", "."),
      category: editedExpense.category,
      date: editedExpense.date,
    };

    const expenseRef = doc(
      db,
      "users",
      userData.uid,
      "expenses",
      editedExpense.id,
    );

    try {
      await updateDoc(expenseRef, expenseWithValueFixed);
      alert("Gasto atualizado com sucesso!");
      closeModal();
      await getDailyExpenses();
    } catch (error) {
      alert(`Erro ao atualizar gasto: ${error}`);
    }
  };

  const handleExpenseValueChange = (e) => {
    let inputValue = e.target.value;
    // Remove todos os caracteres que não são números
    inputValue = inputValue.replace(/[^\d,]/g, "");
    setExpenseValue(inputValue);
  };

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
                      getCurrentExpense={() => {
                        setCurrentExpense(expense);
                        openModal();
                      }}
                    />
                  );
                })
              ) : (
                <p className="flex w-full justify-center text-2xl font-normal text-[#102a42]">
                  Sem gastos registrados nos últimos 7 dias
                </p>
              )}
            </div>
          </article>
        </section>
      </section>
      {isModalOpen && (
        <Modal>
          <section className="flex flex-col rounded bg-[#F7F6FA] p-2">
            <article className="flex w-full justify-end">
              <button
                type="button"
                className="h-8 w-8 cursor-pointer rounded border-none bg-red-600 pb-1 text-lg text-white"
                onClick={closeModal}
              >
                x
              </button>
            </article>
            <EditForm
              categories={categories}
              maxDate={dayjs().format("YYYY-MM-DD")}
              expense={editedExpense}
              handleExpenseInputs={handleExpenseInputs}
              handleExpenseValueChange={handleExpenseValueChange}
              updateExpense={submitUpdatedExpense}
              expenseValue={expenseValue}
            />
          </section>
        </Modal>
      )}
    </main>
  );
};
