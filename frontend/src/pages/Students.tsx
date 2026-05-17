import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentNumber: string;
  currentClass: string;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || []);
      } else {
        toast.error(data.message || "Failed to fetch students");
      }
    } catch (err) {
      toast.error("An error occurred while fetching students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="page-header">
        <h1>Student Directory</h1>
        <button className="btn-primary">Add Student</button>
      </header>

      <div className="management-card">
        {loading ? (
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Enrollment No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.enrollmentNumber}</td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.currentClass}</td>
                    <td>
                      <button className="btn-edit">Edit</button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      No students found.
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
