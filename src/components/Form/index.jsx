import dayjs from "dayjs";
import { addDoc, collection, doc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../API/firebase";
import { useUser } from "../../hooks/useUser";
import useCategories from "../../hooks/useCategories";
import { toaster } from "../../utils/toaster";
import Modal from "../Modal";
import useModal from "../../hooks/useModal";
import { installments } from "../../utils/payOvertimeValues";

const Form = () => {
  const [expenseValue, setExpenseValue] = useState("0,00");
  const [expense, setExpense] = useState({
    title: "",
    value: expenseValue,
    category: "food",
    date: dayjs().format("YYYY-MM-DD"),
  });

  const [payOvertimeInfo, setPayOvertimeInfo] = useState(2);
  const [isPayOvertime, setIsPayOvertime] = useState(false);

  const { userData } = useUser();
  const { categories } = useCategories();
  const { sucessToast, errorToast } = toaster();
  const { isModalOpen, openModal, closeModal } = useModal();

  const addExpense = async (expense, userRef) => {
    await addDoc(collection(doc(db, "users", userRef), "expenses"), {
      ...expense,
      value: expenseValue.replace(",", "."),
    });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (expenseValue === "0,00") {
      errorToast("Insira um valor válido!");
      return;
    }

    try {
      if (isPayOvertime) {
        let successfullyInstallments = 0;
        let failedInstallments = 0;

        for (let i = 0; i < payOvertimeInfo; i++) {
          const nextMonth = dayjs(expense.date).add(i, "month").valueOf();

          const expenseFormatted = {
            ...expense,
            title: expense.title + ` ${i + 1}/${payOvertimeInfo}`,
            date: nextMonth,
          };

          try {
            await addExpense(expenseFormatted, userData.uid);
            successfullyInstallments++;
          } catch (error) {
            failedInstallments++;
          }
        }

        if (successfullyInstallments > 0) {
          sucessToast(
            `${successfullyInstallments} parcela(s) adicionada(s) com sucesso!`,
          );
        }

        if (failedInstallments > 0) {
          errorToast(
            `${failedInstallments} parcela(s) falharam ao ser adicionadas.`,
          );
        }
      } else {
        const expenseWithFormatedDate = {
          ...expense,
          //trocando o formato da data para milisegundos, assim faciliando na hora das conversões
          date: dayjs(expense.date).valueOf(),
        };

        await addExpense(expenseWithFormatedDate, userData.uid);
        sucessToast("Gasto adicionado com sucesso!");
      }

      setExpense({
        ...expense,
        title: "",
        value: "",
        category: "food",
        date: dayjs().format("YYYY-MM-DD"),
      });

      setExpenseValue("0,00");
      setIsPayOvertime(false);
    } catch (error) {
      errorToast(`Erro ao criar gasto: ${error}`);
    }
  };

  const handleExpenseInputs = (ev) => {
    setExpense((prev) => ({
      ...prev,
      [ev.target.name]: ev.target.value,
    }));
  };

  const handleExpenseValueChange = (e) => {
    let inputValue = e.target.value;

    // Remove todos os caracteres que não são números
    inputValue = inputValue.replace(/\D/g, "");

    // Adiciona zeros à esquerda se necessário
    while (inputValue.length < 3) {
      inputValue = "0" + inputValue;
    }

    // Formata o valor para incluir a vírgula
    const formattedValue = inputValue.slice(0, -2) + "," + inputValue.slice(-2);

    // Remove zeros à esquerda desnecessários no lado dos reais
    const finalValue = formattedValue.replace(/^0+(?!,)/, "");

    // Se após a remoção dos zeros o valor estiver vazio, atribui "0,00"
    setExpenseValue(finalValue === "" ? "0,00" : finalValue);
  };

  return (
    <article className="flex w-80 items-center justify-center rounded-md bg-[#F7F6FA] shadow-lg max-[320px]:w-72">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 py-6 max-[320px]:gap-2"
      >
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
          <p className="text-lg font-semibold leading-none">
            {isPayOvertime ? "Parcela" : "Valor"}
          </p>
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
        <article
          htmlFor="isPayOverTime"
          className="flex items-center gap-1 text-base font-semibold leading-none"
        >
          <input
            type="checkbox"
            id="isPayOverTime"
            className="filters"
            onChange={() => {
              !isPayOvertime && openModal(), setIsPayOvertime(!isPayOvertime);
            }}
            checked={isPayOvertime}
          />
          Gasto a prazo
          {isPayOvertime && `   (${payOvertimeInfo}x)`}
        </article>
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
            max={dayjs().endOf("year").format("YYYY-MM-DD")}
            required
          />
        </div>
        <button className="rounded-md bg-[#645cff] p-2 text-white shadow-sm shadow-[#645cff]/20 duration-200 hover:shadow-lg hover:shadow-[#645cff]/40">
          Adicionar
        </button>
      </form>
      {isModalOpen && (
        <Modal>
          <section className="relative flex w-40 flex-col gap-2 rounded bg-[#F7F6FA] p-3 max-[430px]:m-5 max-[430px]:w-80 max-[430px]:p-2">
            <button
              type="button"
              className="absolute right-1 top-1 h-7 w-7 cursor-pointer rounded border-none bg-red-600 pb-1 text-white"
              onClick={closeModal}
            >
              x
            </button>
            <article className="flex flex-col items-center gap-2">
              <p className="font-semibold">Parcelas</p>
              <select
                className="h-10 w-full rounded border-[1px] border-[#645cff] bg-transparent p-2 outline-none focus:border-2"
                value={payOvertimeInfo}
                onChange={(ev) => setPayOvertimeInfo(ev.target.value)}
              >
                {installments.map((item) => {
                  return <option key={item.times}>{item.times}</option>;
                })}
              </select>
            </article>
          </section>
        </Modal>
      )}
    </article>
  );
};

export default Form;
