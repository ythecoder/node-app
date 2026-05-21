import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Student {
  _id: string;
  enrollmentNumber: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  currentClass: string | { _id?: string };
  academicYear: string;
  dateOfBirth?: string;
  gender?: string;
  currentSection?: string;
  medicalHistory?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    enrollmentNumber: "",
    currentClass: "",
    academicYear: "",
    dateOfBirth: "",
    gender: "",
    currentSection: "",
    medicalHistory: "",
    allergies: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
  });

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
    } catch {
      toast.error("An error occurred while fetching students");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/v1/students/${deleteConfirmId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Student deleted successfully");
        setDeleteConfirmId(null);
        fetchStudents();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete student");
      }
    } catch {
      toast.error("An error occurred while deleting");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      enrollmentNumber: "",
      currentClass: "60d5ec49f1b2c8a3f8a4e8b2", // Dummy valid ObjectId for demo purposes
      academicYear: new Date().getFullYear().toString(),
      dateOfBirth: "",
      gender: "Male",
      currentSection: "A",
      medicalHistory: "",
      allergies: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
    });
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setModalMode('edit');
    setCurrentStudentId(student._id);
    populateFormData(student);
    setShowModal(true);
  };

  const openViewModal = (student: Student) => {
    setModalMode('view');
    setCurrentStudentId(student._id);
    populateFormData(student);
    setShowModal(true);
  };

  const populateFormData = (student: Student) => {
    const currentClassId =
      typeof student.currentClass === "string"
        ? student.currentClass
        : student.currentClass?._id || "60d5ec49f1b2c8a3f8a4e8b2";

    setFormData({
      firstName: student.userId?.firstName || "",
      lastName: student.userId?.lastName || "",
      email: student.userId?.email || "",
      password: "",
      enrollmentNumber: student.enrollmentNumber || "",
      currentClass: currentClassId,
      academicYear: student.academicYear || "",
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
      gender: student.gender || "Male",
      currentSection: student.currentSection || "",
      medicalHistory: student.medicalHistory || "",
      allergies: student.allergies ? student.allergies.join(", ") : "",
      emergencyContactName: student.emergencyContact?.name || "",
      emergencyContactRelation: student.emergencyContact?.relationship || "",
      emergencyContactPhone: student.emergencyContact?.phone || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'view') return;

    const token = localStorage.getItem("token");
    const url = modalMode === 'edit' 
      ? `http://localhost:5000/api/v1/students/${currentStudentId}`
      : `http://localhost:5000/api/v1/students`;
      
    const method = modalMode === 'edit' ? "PUT" : "POST";

    const payload = {
      ...formData,
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRelation,
        phone: formData.emergencyContactPhone,
      }
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Student ${modalMode === 'edit' ? 'updated' : 'added'} successfully!`);
        setShowModal(false);
        fetchStudents();
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const isView = modalMode === 'view';
  const isEdit = modalMode === 'edit';

  return (
    <div className="home-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Student Directory</h1>
        <button 
          className="btn-primary" 
          onClick={openAddModal}
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}
        >
          + Add Student
        </button>
      </header>

      <div className="management-card" style={{ padding: '0', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--surface-border)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px', borderColor: 'rgba(99,102,241,0.2)', borderTopColor: 'var(--primary)' }}></div>
          </div>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(248, 250, 252, 0.5)' }}>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Enrollment No.</th>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Name</th>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Email</th>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Academic Year</th>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} style={{ borderBottom: '1px solid var(--surface-border)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{student.enrollmentNumber}</td>
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold', fontSize: '0.8rem' }}>
                          {(student.userId?.firstName || 'U')[0]}
                        </div>
                        {student.userId?.firstName} {student.userId?.lastName}
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)' }}>{student.userId?.email}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)' }}>
                      <span style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 }}>
                        {student.academicYear || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => openViewModal(student)}
                          style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                        >
                          View
                        </button>
                        <button 
                          onClick={() => openEditModal(student)}
                          style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(student._id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: '4rem', color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>No students found.</p>
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Click the "Add Student" button to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '24px', width: '100%', maxWidth: '750px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            
            {/* Header block (Not scrollable) */}
            <div style={{ background: 'var(--surface)', padding: '1.8rem 2.5rem 1.2rem 2.5rem', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: 700 }}>
                  {isView ? "Student Details" : isEdit ? "Edit Student Details" : "Add New Student"}
                </h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                  {isView ? "Comprehensive overview of student information." : isEdit ? "Update the student's academic and medical information." : "Fill out the comprehensive form below to register a new student."}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ background: 'transparent', border: 'none', fontSize: '2.2rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', transition: 'background 0.2s', marginTop: '-0.2rem', marginRight: '-0.5rem' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                &times;
              </button>
            </div>
            
            {/* Form body */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              
              {/* Scrollable inputs wrapper (only this scrolls, keeping scrollbar inside borders) */}
              <div className="custom-scrollbar" style={{ overflowY: 'auto', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
                
                {/* Personal Details */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Personal Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>First Name</label>
                      <input name="firstName" value={formData.firstName} onChange={handleInputChange} required disabled={isView || isEdit} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: (isView || isEdit) ? '#f8fafc' : 'white', opacity: (isView || isEdit) ? 0.8 : 1 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Last Name</label>
                      <input name="lastName" value={formData.lastName} onChange={handleInputChange} required disabled={isView || isEdit} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: (isView || isEdit) ? '#f8fafc' : 'white', opacity: (isView || isEdit) ? 0.8 : 1 }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={isView || isEdit} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: (isView || isEdit) ? '#f8fafc' : 'white', opacity: (isView || isEdit) ? 0.8 : 1 }} />
                    </div>
                    {!isEdit && !isView && (
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Date of Birth</label>
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} disabled={isView || isEdit} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: (isView || isEdit) ? '#f8fafc' : 'white', opacity: (isView || isEdit) ? 0.8 : 1 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} disabled={isView || isEdit} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: (isView || isEdit) ? '#f8fafc' : 'white', opacity: (isView || isEdit) ? 0.8 : 1 }}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Academic Details */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Academic Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Enrollment No.</label>
                      <input name="enrollmentNumber" value={formData.enrollmentNumber} onChange={handleInputChange} required disabled={isView || isEdit} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: (isView || isEdit) ? '#f8fafc' : 'white', opacity: (isView || isEdit) ? 0.8 : 1 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Academic Year</label>
                      <input name="academicYear" value={formData.academicYear} onChange={handleInputChange} required disabled={isView} placeholder="e.g. 2024-2025" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Section</label>
                      <input name="currentSection" value={formData.currentSection} onChange={handleInputChange} disabled={isView} placeholder="e.g. A" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
                    </div>
                  </div>
                </div>

                {/* Medical & Emergency */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Medical & Emergency</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Allergies (comma separated)</label>
                      <input name="allergies" value={formData.allergies} onChange={handleInputChange} disabled={isView} placeholder="Peanuts, Dust" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Medical History</label>
                      <input name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} disabled={isView} placeholder="Any prior conditions" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
                    </div>
                  </div>
                  
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Emergency Contact</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
                    <input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} disabled={isView} placeholder="Name" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
                    <input name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleInputChange} disabled={isView} placeholder="Relation" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
                    <input name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} disabled={isView} placeholder="Phone" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
                  </div>
                </div>
              </div>

              {/* Form Footer (fixed below fields) */}
              <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem 2.5rem', background: 'var(--surface)', borderTop: '1px solid var(--surface-border)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', background: '#f8fafc', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}>{isView ? 'Close' : 'Cancel'}</button>
                {!isView && (
                  <button type="submit" style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>{isEdit ? 'Save Changes' : 'Register Student'}</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#ef4444', fontSize: '1.8rem' }}>
              🗑️
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Delete Student?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this student record? This action cannot be undone and will also remove their user account.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--surface-border)', background: '#f8fafc', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
