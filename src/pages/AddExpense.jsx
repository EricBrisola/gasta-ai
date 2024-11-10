import Form from "../components/Form";
import Navbar from "../components/Navbar";

export const AddExpense = () => {
  return (
    <main className="flex h-screen flex-col">
      <Navbar />
      <section className="flex flex-1 flex-col items-center justify-center gap-7 bg-[#E2DEE9] text-[#102a42]">
        <p className="text-2xl leading-none tracking-widest text-[#102a42]">
          Registre seus gastos!
        </p>
        <Form />
      </section>
    </main>
  );
};
