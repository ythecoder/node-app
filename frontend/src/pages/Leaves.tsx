import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Leave {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
}

export default function Leaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/staff/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLeaves(data.leaves || []);
      } else {
        toast.error(data.message || "Failed to fetch leaves");
      }
    } catch (err) {
      toast.error("An error occurred while fetching leaves");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="page-header">
        <h1>Leave Management</h1>
        <button className="btn-primary">Request Leave</button>
      </header>

      <div className="management-card">
        {loading ? (
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`badge badge-${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-edit">Manage</button>
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
