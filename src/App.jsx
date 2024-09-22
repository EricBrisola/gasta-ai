import "./App.css";
import { Login, SignUp, AddExpense } from "./pages";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/" element={<Login />} />
      <Route path="/add-expense" element={<AddExpense />} />
    </Routes>
  );
}

export default App;
