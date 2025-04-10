/* eslint-disable react/prop-types */
const Header = ({ total, date }) => {
  return (
    <header className="flex justify-center pt-4">
      <article className="flex flex-col items-center gap-3">
        <h1 className="text-3xl leading-none tracking-widest text-[#102a42] max-[425px]:text-2xl max-[320px]:text-xl">
          {date}
        </h1>

        <article className="flex w-60 flex-col items-center gap-3 rounded-md bg-[#645cff] p-3 tracking-wider text-white">
          <p className="text-2xl leading-none max-[425px]:text-xl max-[320px]:text-lg">
            Gasto total:
          </p>
          <p className="text-xl leading-none max-[320px]:text-lg">
            R${(total.toFixed(2) + "").replace(".", ",")}
          </p>
        </article>
      </article>
    </header>
  );
};
export default Header;
