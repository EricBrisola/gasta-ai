import "./App.css";
import { Login, SignUp, AddExpense, Today, LastWeek } from "./pages";
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
      <Route
        path="/today"
        element={
          <ProtectedRoute>
            <Today />
          </ProtectedRoute>
        }
      />
      <Route
        path="/last-week"
        element={
          <ProtectedRoute>
            <LastWeek />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
