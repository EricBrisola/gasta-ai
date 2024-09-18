import Form from "../components/Form";

export const AddExpense = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-7 bg-[#E2DEE9] text-[#102a42]">
      <p className="text-2xl leading-none tracking-widest text-[#102a42]">
        Registre seus gastos!
      </p>
      <Form />
    </main>
  );
};
