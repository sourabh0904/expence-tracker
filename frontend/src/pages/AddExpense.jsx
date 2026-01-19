import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AddExpense = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Form State
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0); // For validation display
  const [paidBy, setPaidBy] = useState("");
  
  // Group & Participants State
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [allUsers, setAllUsers] = useState([]); // All system users (for non-group expenses)
  const [participants, setParticipants] = useState([]); // Array of user IDs
  
  // Split State
  const [splitType, setSplitType] = useState("equal");
  const [splitDetails, setSplitDetails] = useState({}); // { userId: { amount, percentage } }

  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, groupsRes] = await Promise.all([
            api.get("/auth/users"),
            api.get("/groups")
        ]);
        setAllUsers(usersRes.data);
        setGroups(groupsRes.data);
        if (user) {
            setPaidBy(user._id);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [user]);

  // Update totalAmount number when string changes
  useEffect(() => {
      setTotalAmount(Number(amount) || 0);
  }, [amount]);

  // Handle Group Selection
  useEffect(() => {
    if (selectedGroup) {
      const group = groups.find(g => g._id === selectedGroup);
      if (group) {
        // Pre-select group members
        const memberIds = group.members.map(m => m._id);
        setParticipants(memberIds);
      }
    } else {
        // Reset participants if no group selected (optional, maybe keep them)
        setParticipants([]);
    }
  }, [selectedGroup, groups]);

  const handleParticipantChange = (e) => {
    const userId = e.target.value;
    if (e.target.checked) {
      setParticipants([...participants, userId]);
    } else {
      setParticipants(participants.filter((id) => id !== userId));
      // Remove from splitDetails
      const newDetails = { ...splitDetails };
      delete newDetails[userId];
      setSplitDetails(newDetails);
    }
  };

  const handleSplitChange = (userId, field, value) => {
    setSplitDetails({
        ...splitDetails,
        [userId]: {
            ...splitDetails[userId],
            [field]: Number(value)
        }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!participants.includes(paidBy)) {
      setError("Payer must be included in participants list");
      return;
    }
    if (participants.length === 0) {
        setError("Please select at least one participant");
        return;
    }

    // Advanced Split Validation
    const detailsArray = participants.map(userId => ({
        userId,
        amount: splitDetails[userId]?.amount || 0,
        percentage: splitDetails[userId]?.percentage || 0
    }));

    if (splitType === "unequal") {
        const sum = detailsArray.reduce((acc, curr) => acc + curr.amount, 0);
        if (Math.abs(sum - totalAmount) > 0.01) {
            setError(`Total split amount (${sum}) does not match expense amount (${totalAmount})`);
            return;
        }
    } else if (splitType === "percentage") {
        const sum = detailsArray.reduce((acc, curr) => acc + curr.percentage, 0);
        if (Math.abs(sum - 100) > 0.1) {
            setError(`Total percentage (${sum}%) must be 100%`);
            return;
        }
    }

    try {
      await api.post("/expenses", {
        description,
        amount: totalAmount,
        paidBy,
        participants,
        groupId: selectedGroup || null,
        splitType,
        splitDetails: detailsArray
      });
      navigate(selectedGroup ? `/groups/${selectedGroup}` : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding expense");
    }
  };

  // Determine which list of users to show
  const visibleUsers = selectedGroup 
    ? (groups.find(g => g._id === selectedGroup)?.members || []) // Show group members (populated objects)
    : allUsers; // Show all users

  return (
    <div className="container">
      <h1>Add Expense</h1>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      <form onSubmit={handleSubmit} className="card">
        
        {/* Description & Amount */}
        <div className="form-group">
          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.01" step="0.01" />
        </div>

        {/* Group Selection */}
        <div className="form-group">
            <label>Group (Optional)</label>
            <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="form-control" style={{ width: "100%", padding: "10px" }}>
                <option value="">No Group</option>
                {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
        </div>

        {/* Payer Selection */}
        <div className="form-group">
          <label>Paid By</label>
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="form-control" required style={{ width: "100%", padding: "10px" }}>
            <option value="">Select User</option>
            {/* Show all users options to ensure payer is selectable even if filtered logic changes, or stick to visibleUsers */}
            {(selectedGroup ? visibleUsers : allUsers).map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Participants Selection */}
        <div className="form-group">
          <label>Participants</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
            {visibleUsers.map((u) => (
              <label key={u._id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  value={u._id}
                  checked={participants.includes(u._id)}
                  onChange={handleParticipantChange}
                  style={{ width: "auto" }}
                />
                {u.name}
              </label>
            ))}
          </div>
        </div>

        {/* Split Type */}
        <div className="form-group">
            <label>Split Type</label>
            <select value={splitType} onChange={(e) => setSplitType(e.target.value)} className="form-control" style={{ width: "100%", padding: "10px" }}>
                <option value="equal">Equal</option>
                <option value="unequal">Unequal Amounts</option>
                <option value="percentage">Percentage</option>
            </select>
        </div>

        {/* Dynamic Split Inputs */}
        {splitType !== "equal" && (
            <div className="form-group">
                <label>Split Details</label>
                {participants.map(userId => {
                    const userObj = visibleUsers.find(u => u._id === userId) || allUsers.find(u => u._id === userId);
                    return (
                        <div key={userId} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                            <span style={{ width: "100px" }}>{userObj?.name}</span>
                            {splitType === "unequal" && (
                                <input 
                                    type="number" 
                                    placeholder="Amount" 
                                    value={splitDetails[userId]?.amount || ""} 
                                    onChange={(e) => handleSplitChange(userId, "amount", e.target.value)}
                                    step="0.01"
                                />
                            )}
                            {splitType === "percentage" && (
                                <input 
                                    type="number" 
                                    placeholder="%" 
                                    value={splitDetails[userId]?.percentage || ""} 
                                    onChange={(e) => handleSplitChange(userId, "percentage", e.target.value)}
                                    step="0.01"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        )}

        <button type="submit" className="btn">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
