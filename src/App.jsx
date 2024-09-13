import "./App.css";
import { Login, SignUp } from "./pages";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
