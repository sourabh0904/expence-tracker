import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleMemberChange = (e) => {
    const userId = e.target.value;
    if (e.target.checked) {
      setSelectedMembers([...selectedMembers, userId]);
    } else {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/groups", {
        name,
        members: selectedMembers,
      });
      navigate("/groups");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating group");
    }
  };

  return (
    <div className="container">
      <h1>Create Group</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Select Members</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {users.map((u) => (
              <label key={u._id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  value={u._id}
                  checked={selectedMembers.includes(u._id)}
                  onChange={handleMemberChange}
                  style={{ width: "auto" }}
                />
                {u.name}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="btn">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroup;
