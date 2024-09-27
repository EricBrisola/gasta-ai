/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

function NavbarBtn({ textContent, path, style }) {
  return (
    <p className={style}>
      <Link to={path}>{textContent}</Link>
    </p>
  );
}
export default NavbarBtn;