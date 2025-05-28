import skeletonImage from "../../assets/skeleton-image.png";
const ExpenseCardSkeleton = () => {
  return (
    <article className="flex h-48 w-48 flex-col items-center justify-between rounded-md bg-[#F7F6FA] text-white shadow-md max-[430px]:h-44 max-[430px]:w-44 max-[376px]:h-40 max-[376px]:w-40 max-[320px]:h-36 max-[320px]:w-36">
      <div className="flex h-9 w-full items-center justify-center rounded-t-md border-b-[1px] p-1">
        <p className="h-5 w-40 animate-pulse rounded-md bg-gray-300"></p>
      </div>
      <img
        src={skeletonImage}
        alt="category-img"
        className="h-9 w-9 animate-pulse rounded-md"
      />
      <p className="h-6 w-24 animate-pulse rounded-md bg-gray-300"></p>
      <div className="flex h-1/6 w-full rounded-b-md border-t-2">
        <div className="flex w-1/2 items-center justify-center rounded-bl-md border-r-[1px] border-gray-300">
          <p className="h-5 w-20 animate-pulse rounded-md bg-gray-300"></p>
        </div>
        <div className="flex w-1/2 items-center justify-center rounded-bl-md border-l-[1px] border-gray-300">
          <p className="h-5 w-20 animate-pulse rounded-md bg-gray-300"></p>
        </div>
      </div>
    </article>
  );
};
export default ExpenseCardSkeleton;
