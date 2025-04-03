/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

function NavbarBtn({ textContent, path, style }) {
  return (
    <p className={style}>
      <Link to={path} className="max-[425px]:w-full max-[425px]:text-center">
        {textContent}
      </Link>
    </p>
  );
}
export default NavbarBtn;
