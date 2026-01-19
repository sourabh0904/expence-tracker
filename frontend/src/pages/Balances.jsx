import { useEffect, useState } from "react";
import api from "../api/axios";

const Balances = () => {
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get("/expenses/balance");
        setBalances(response.data);
      } catch (err) {
        console.error("Error fetching balances:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Balances</h1>
      <div className="card">
        {Object.keys(balances).length === 0 ? (
          <p>No balances calculated yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Person</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(balances).map(([person, amount]) => (
                <tr key={person}>
                  <td>{person}</td>
                  <td style={{ color: amount >= 0 ? "green" : "red" }}>
                    {amount >= 0 ? `Gets back $${amount}` : `Owes $${Math.abs(amount)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Balances;
