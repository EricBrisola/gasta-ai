import "./App.css";
import { Login, SignUp, AddExpense } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/" element={<Login />} />
      <Route
        path="/add-expense"
        element={
          <ProtectedRoute>
            <AddExpense />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
