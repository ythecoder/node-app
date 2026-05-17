import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Admission {
  _id: string;
  applicationNumber: string;
  studentName: string;
  appliedClass: string;
  status: string;
  applicationDate: string;
}

export default function Admissions() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/students/admissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAdmissions(data.admissions || []);
      } else {
        toast.error(data.message || "Failed to fetch admissions");
      }
    } catch (err) {
      toast.error("An error occurred while fetching admissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="page-header">
        <h1>Admissions</h1>
        <button className="btn-primary">New Admission</button>
      </header>

      <div className="management-card">
        {loading ? (
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>App No.</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((adm) => (
                  <tr key={adm._id}>
                    <td>{adm.applicationNumber}</td>
                    <td>{adm.studentName}</td>
                    <td>{adm.appliedClass}</td>
                    <td>{new Date(adm.applicationDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${adm.status.toLowerCase()}`}>
                        {adm.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-edit">Review</button>
                    </td>
                  </tr>
                ))}
                {admissions.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No admissions found.
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
