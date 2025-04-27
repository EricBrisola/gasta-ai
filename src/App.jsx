import "./App.css";
import {
  Login,
  SignUp,
  AddExpense,
  Today,
  LastWeek,
  LastMonth,
  AllExpenses,
} from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
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
      <Route
        path="/last-month"
        element={
          <ProtectedRoute>
            <LastMonth />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-expenses"
        element={
          <ProtectedRoute>
            <AllExpenses />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
