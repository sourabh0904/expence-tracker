import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get("/groups");
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching groups", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>My Groups</h1>
        <Link to="/groups/create" className="btn">Create Group</Link>
      </div>
      {groups.length === 0 ? (
        <p>You are not in any groups.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {groups.map((group) => (
            <div key={group._id} className="card">
              <h3>{group.name}</h3>
              <p>Members: {group.members.length}</p>
              <Link to={`/groups/${group._id}`} className="btn" style={{ marginTop: "10px" }}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;
