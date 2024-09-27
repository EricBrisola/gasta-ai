import { useEffect, useState } from "react";
import "./App.css";
import { Login, SignUp, AddExpense } from "./pages";
import { Routes, Route } from "react-router-dom";

function App() {
  const [token, setToken] = useState(false);

  if (token) {
    localStorage.setItem("token", JSON.stringify(token));
  }

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     const data = JSON.parse(localStorage.getItem("token"));
  //     setToken(data);
  //   }
  // }, []);

  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/" element={<Login setToken={setToken} />} />
      <Route path="/add-expense" element={<AddExpense />} />
    </Routes>
  );
}

export default App;
