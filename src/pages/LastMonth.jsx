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
  orderBy,
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
import useCategories from "../hooks/useCategories";
import { toaster } from "../utils/toaster";

export const LastMonth = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
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
  const {
    categories,
    cleanCategoriesFiltered,
    getChosenCategories,
    handleFilterChange,
  } = useCategories();
  const { sucessToast, errorToast } = toaster();

  useEffect(() => {
    if (userData?.uid) getMonthlyExpenses();
  }, [userData]);

  //usado para atualizar os valores totais dos gastos diarios
  useEffect(() => {
    getmonthlyTotal();
  }, [monthlyExpenses]);

  const getmonthlyTotal = () => {
    const monthlyTotalValue =
      monthlyExpenses.length > 0
        ? monthlyExpenses.reduce((acc, item) => {
            return (acc += +item.value);
          }, 0)
        : 0;

    setMonthlyTotal(monthlyTotalValue);
  };

  const getMonthlyExpenses = async () => {
    try {
      startLoading();
      const expenseCollection = collection(
        db,
        "users",
        userData?.uid,
        "expenses",
      );

      // Filtrar os gastos que foram referentes ao ultimo mes
      const q = query(
        expenseCollection,
        where("date", ">=", dayjs().startOf("month").valueOf()),
        where("date", "<=", dayjs().endOf("month").valueOf()),
      );

      // Buscar os documentos
      const querySnapshot = await getDocs(q);
      if (querySnapshot) stopLoading();

      setMonthlyExpenses(() => {
        const newExpenses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return newExpenses;
      });
    } catch (error) {
      errorToast(`Erro: ${error}`);
    } finally {
      stopLoading();
    }
  };

  const deleteExpense = async (id, title) => {
    try {
      await deleteDoc(doc(db, "users", userData.uid, "expenses", id));
      await getMonthlyExpenses();
    } catch (error) {
      errorToast(`Erro: ${error}\n Ao excluir o gasto: ${title}`);
    }
  };

  const setCurrentExpense = (currentExpense) => {
    // converte a data de milisegundos para um formato que o input possa interpretar (YYYY-MM-DD)
    const formatedDate = dayjs(dayjs(currentExpense.date).valueOf()).format(
      "YYYY-MM-DD",
    );

    // seta o gasto que quer alterar dentro dos inputs do modal
    setEditedExpense({ ...currentExpense, date: formatedDate });
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
      ...editedExpense,
      //troca de vírgula para ponto para quando salvar nao resultar em NaN
      value: expenseValue.replace(",", "."),
      //converte a data novamente para milisegundos para ser salvo no firebase
      date: dayjs(editedExpense.date).valueOf(),
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
      sucessToast("Gasto atualizado com sucesso!");
      closeModal();
      await getMonthlyExpenses();
    } catch (error) {
      errorToast(`Erro ao atualizar gasto: ${error}`);
    }
  };

  const handleExpenseValueChange = (e) => {
    let inputValue = e.target.value;
    // Remove todos os caracteres que não são números
    inputValue = inputValue.replace(/[^\d,]/g, "");
    setExpenseValue(inputValue);
  };

  const getExpensesFiltered = async () => {
    const chosenCategories = getChosenCategories();

    if (chosenCategories.length < 1) {
      errorToast("Filtros vazios");
      return;
    }

    try {
      startLoading();
      const expenseCollection = collection(
        db,
        "users",
        userData?.uid,
        "expenses",
      );

      // Filtrar os gastos que foram referentes ao dia juntamente com as categorias
      const q = query(
        expenseCollection,
        where("date", ">=", dayjs().startOf("month").valueOf()),
        where("date", "<=", dayjs().endOf("month").valueOf()),
        where("category", "in", chosenCategories),
        orderBy("date", "desc"),
      );

      // Buscar os documentos
      const querySnapshot = await getDocs(q);
      if (querySnapshot) stopLoading();

      setMonthlyExpenses(() => {
        const newExpenses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return newExpenses;
      });
    } catch (error) {
      errorToast(`Erro: ${error}`);
    } finally {
      stopLoading();
    }
  };

  const cleanAllFilters = async () => {
    cleanCategoriesFiltered();

    await getMonthlyExpenses();
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#E2DEE9]">
      <Navbar />
      <section className="flex flex-1 max-[430px]:pt-10">
        <Sidebar
          categories={categories}
          filterExpenses={getExpensesFiltered}
          cleanFilters={cleanAllFilters}
          handleChange={handleFilterChange}
        />
        <section className="flex flex-1 flex-col gap-3">
          <Header
            total={monthlyTotal}
            date={`01/0${dayjs().month() + 1}/${dayjs().year()} - ${dayjs().endOf("month").format("DD/MM/YYYY")}`}
          />
          <div className="flex flex-wrap justify-center gap-6 px-7 py-4 max-[430px]:px-1 max-[430px]:py-4 max-[320px]:px-0">
            {isLoading ? (
              <Modal>
                <Animation animation={loadingAnimation} />
              </Modal>
            ) : monthlyExpenses.length >= 1 ? (
              monthlyExpenses.map((expense) => {
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
                Sem gastos registrados neste mês
              </p>
            )}
          </div>
        </section>
      </section>
      {isModalOpen && (
        <Modal>
          <section className="flex flex-col rounded bg-[#F7F6FA] p-4 max-[430px]:m-5 max-[430px]:w-80 max-[430px]:p-2">
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
