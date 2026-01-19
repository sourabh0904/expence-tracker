import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const res = await api.get(`/groups/${id}`);
        setGroup(res.data.group);
        setExpenses(res.data.expenses);
      } catch (err) {
        setError("Failed to load group details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupDetails();
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container" style={{color: 'red'}}>{error}</div>;

  return (
    <div className="container">
      <h1>{group.name}</h1>
      <div className="card">
        <h3>Members</h3>
        <ul>
          {group.members.map((member) => (
            <li key={member._id}>{member.name} ({member.email})</li>
          ))}
        </ul>
      </div>

      <h2>Group Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses in this group yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
            {expenses.map((expense) => (
            <div key={expense._id} className="card">
                <h3>{expense.description}</h3>
                <p><strong>Amount:</strong> ${expense.amount}</p>
                <p><strong>Paid By:</strong> {expense.paidBy?.name || "Unknown"}</p>
                <p><strong>Split Type:</strong> {expense.splitType}</p>
                <p><strong>Participants:</strong> {expense.participants?.map(p => p.name).join(", ")}</p>
                <p><small>{new Date(expense.date).toLocaleDateString()}</small></p>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
