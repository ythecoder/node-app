import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Staff {
  _id: string;
  staffId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  designation: string;
  department: string;
  joiningDate?: string;
  employmentType?: string;
  employmentStatus?: string;
  basicSalary?: number;
  qualifications?: string[];
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [currentStaffId, setCurrentStaffId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    staffId: "",
    designation: "",
    department: "",
    joiningDate: "",
    employmentType: "Full-time",
    basicSalary: "",
    gender: "Male",
    qualifications: "",
  });

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
        setStaffList(data.staff || []);
      } else {
        toast.error(data.message || "Failed to fetch staff");
      }
    } catch {
      toast.error("An error occurred while fetching staff");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/v1/staff/${deleteConfirmId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Staff member deleted successfully");
        setDeleteConfirmId(null);
        fetchStaff();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete staff member");
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
      phone: "",
      staffId: "",
      designation: "",
      department: "",
      joiningDate: "",
      employmentType: "Full-time",
      basicSalary: "",
      gender: "Male",
      qualifications: "",
    });
    setShowModal(true);
  };

  const openEditModal = (staffMember: Staff) => {
    setModalMode('edit');
    setCurrentStaffId(staffMember._id);
    populateFormData(staffMember);
    setShowModal(true);
  };

  const openViewModal = (staffMember: Staff) => {
    setModalMode('view');
    setCurrentStaffId(staffMember._id);
    populateFormData(staffMember);
    setShowModal(true);
  };

  const populateFormData = (staffMember: Staff) => {
    setFormData({
      firstName: staffMember.userId?.firstName || "",
      lastName: staffMember.userId?.lastName || "",
      email: staffMember.userId?.email || "",
      password: "",
      phone: staffMember.userId?.phone || "",
      staffId: staffMember.staffId || "",
      designation: staffMember.designation || "",
      department: staffMember.department || "",
      joiningDate: staffMember.joiningDate ? new Date(staffMember.joiningDate).toISOString().split('T')[0] : "",
      employmentType: staffMember.employmentType || "Full-time",
      basicSalary: staffMember.basicSalary?.toString() || "",
      gender: "Male",
      qualifications: staffMember.qualifications ? staffMember.qualifications.join(", ") : "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'view') return;

    const token = localStorage.getItem("token");
    const url = modalMode === 'edit' 
      ? `http://localhost:5000/api/v1/staff/${currentStaffId}`
      : `http://localhost:5000/api/v1/staff`;
      
    const method = modalMode === 'edit' ? "PUT" : "POST";

    const payload = modalMode === 'edit' ? {
      designation: formData.designation,
      department: formData.department,
      basicSalary: formData.basicSalary ? parseFloat(formData.basicSalary) : undefined,
      qualifications: formData.qualifications ? formData.qualifications.split(',').map(q => q.trim()) : [],
    } : {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      staffId: formData.staffId,
      designation: formData.designation,
      department: formData.department,
      joiningDate: formData.joiningDate,
      employmentType: formData.employmentType,
      basicSalary: formData.basicSalary ? parseFloat(formData.basicSalary) : undefined,
      gender: formData.gender,
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
        toast.success(`Staff member ${modalMode === 'edit' ? 'updated' : 'added'} successfully!`);
        setShowModal(false);
        fetchStaff();
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
        <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Staff Directory</h1>
        <button 
          className="btn-primary" 
          onClick={openAddModal}
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}
        >
          + Add Staff Member
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
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Staff ID</th>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Name</th>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Email</th>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Designation</th>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Department</th>
                  <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--surface-border)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((member) => (
                  <tr key={member._id} style={{ borderBottom: '1px solid var(--surface-border)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{member.staffId}</td>
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold', fontSize: '0.8rem' }}>
                          {(member.userId?.firstName || 'S')[0]}
                        </div>
                        {member.userId?.firstName} {member.userId?.lastName}
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)' }}>{member.userId?.email}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)' }}>{member.designation}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)' }}>
                      <span style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 }}>
                        {member.department || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => openViewModal(member)}
                          style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                        >
                          View
                        </button>
                        <button 
                          onClick={() => openEditModal(member)}
                          style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(member._id)}
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
                {staffList.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: '4rem', color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>No staff members found.</p>
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Click the "Add Staff Member" button to get started.</p>
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
                  {isView ? "Staff Details" : isEdit ? "Edit Staff Details" : "Add New Staff Member"}
                </h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                  {isView ? "Complete staff member information." : isEdit ? "Update the staff member's professional information." : "Fill out the form below to register a new staff member."}
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
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={isView} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
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

                {/* Professional Details */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Professional Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Staff ID</label>
                      <input name="staffId" value={formData.staffId} onChange={handleInputChange} required disabled={isView || isEdit} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: (isView || isEdit) ? '#f8fafc' : 'white', opacity: (isView || isEdit) ? 0.8 : 1 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Designation</label>
                      <select name="designation" value={formData.designation} onChange={handleInputChange} required disabled={isView} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }}>
                        <option value="">Select Designation</option>
                        <option value="Principal">Principal</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Librarian">Librarian</option>
                        <option value="Counselor">Counselor</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Department</label>
                      <input name="department" value={formData.department} onChange={handleInputChange} disabled={isView} placeholder="e.g. Mathematics" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Employment Type</label>
                      <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} disabled={isView} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Joining Date</label>
                      <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} disabled={isView || isEdit} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: (isView || isEdit) ? '#f8fafc' : 'white', opacity: (isView || isEdit) ? 0.8 : 1 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Basic Salary</label>
                      <input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleInputChange} disabled={isView} placeholder="e.g. 50000" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1 }} />
                    </div>
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Qualifications</h3>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Qualifications (comma separated)</label>
                    <textarea name="qualifications" value={formData.qualifications} onChange={handleInputChange} disabled={isView} placeholder="e.g. B.Tech, M.A., Teaching Certificate" style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', boxSizing: 'border-box', background: isView ? '#f8fafc' : 'white', opacity: isView ? 0.8 : 1, fontFamily: 'inherit', minHeight: '80px' }} />
                  </div>
                </div>
              </div>

              {/* Form Footer (fixed below fields) */}
              <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem 2.5rem', background: 'var(--surface)', borderTop: '1px solid var(--surface-border)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--surface-border)', background: '#f8fafc', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}>{isView ? 'Close' : 'Cancel'}</button>
                {!isView && (
                  <button type="submit" style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>{isEdit ? 'Save Changes' : 'Add Staff Member'}</button>
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
            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Delete Staff Member?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this staff member record? This action cannot be undone and will also remove their user account.
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
