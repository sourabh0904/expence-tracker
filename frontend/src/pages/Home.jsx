import { useEffect, useState } from "react";
import api from "../api/axios";

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get("/expenses");
        setExpenses(response.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/expenses/${id}`);
        setExpenses(expenses.filter((exp) => exp._id !== id));
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>All Expenses</h1>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        expenses.map((expense) => (
          <div key={expense._id} className="card">
            <h3>{expense.description}</h3>
            <p><strong>Amount:</strong> ${expense.amount}</p>
            <p><strong>Paid By:</strong> {expense.paidBy?.name || "Unknown"}</p>
            <p><strong>Participants:</strong> {expense.participants?.map(p => p.name).join(", ")}</p>
            <p><small>{new Date(expense.date).toLocaleDateString()}</small></p>
            <button className="btn btn-danger" onClick={() => handleDelete(expense._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
