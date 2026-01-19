import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddExpense from "./pages/AddExpense";
import Balances from "./pages/Balances";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import GroupDetails from "./pages/GroupDetails";
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/balances" element={<Balances />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/create" element={<CreateGroup />} />
            <Route path="/groups/:id" element={<GroupDetails />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
