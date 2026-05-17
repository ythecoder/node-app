import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStaff(data.staff || []);
      } else {
        toast.error(data.message || "Failed to fetch staff");
      }
    } catch (err) {
      toast.error("An error occurred while fetching staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="page-header">
        <h1>Staff Directory</h1>
        <button className="btn-primary">Add Staff Member</button>
      </header>

      <div className="management-card">
        {loading ? (
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id}>
                    <td>{member.employeeId}</td>
                    <td>{member.firstName} {member.lastName}</td>
                    <td>{member.department}</td>
                    <td>{member.designation}</td>
                    <td>
                      <button className="btn-edit">Edit</button>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      No staff members found.
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
