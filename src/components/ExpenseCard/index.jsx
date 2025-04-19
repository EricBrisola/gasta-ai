/* eslint-disable react/prop-types */

const ExpenseCard = ({
  id,
  title,
  value,
  deleteExpense,
  getCurrentExpense,
  categoryImg,
}) => {
  return (
    <article
      key={id}
      className="flex h-48 w-48 flex-col items-center justify-between rounded-md bg-[#F7F6FA] text-white shadow-md duration-200 max-[430px]:h-44 max-[430px]:w-44 max-[376px]:h-40 max-[376px]:w-40 max-[320px]:h-36 max-[320px]:w-36 md:hover:scale-105"
    >
      <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-t-md bg-[#645cff] p-1 text-center text-xl font-bold max-[320px]:text-lg">
        {title[0].toUpperCase() + title.slice(1)}
      </p>
      <img src={categoryImg} alt="category-img" className="h-8 w-8" />
      <p className="text-md text-2xl font-medium text-[#102a42] max-[376px]:text-xl max-[320px]:text-lg">
        R${value.slice(0, 7).replace(".", ",")}
      </p>
      <div className="flex h-1/6 w-full rounded-b-md border-t-2 border-[#645cff]">
        <button
          className="w-1/2 rounded-bl-md border-r-[1px] border-[#645cff] text-green-700"
          onClick={getCurrentExpense}
        >
          Alterar
        </button>
        <button
          className="w-1/2 rounded-br-md border-l-[1px] border-[#645cff] text-red-800"
          onClick={deleteExpense}
        >
          Deletar
        </button>
      </div>
    </article>
  );
};
export default ExpenseCard;
