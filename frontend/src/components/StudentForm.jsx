import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function StudentForm({ setAuth }) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    course: '',
    year: ''
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleError = (error) => {
    console.error(error);
    if (error.response?.status === 401) {
      setAuth(false);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        try {
          const response = await axios.get('/api/students', getAuthHeaders());
          const student = response.data.find(s => s._id === id);
          if (student) {
            setFormData({
              name: student.name,
              rollNumber: student.rollNumber,
              course: student.course,
              year: student.year
            });
          }
        } catch (error) {
          handleError(error);
        }
      };
      fetchStudent();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/api/students/${id}`, formData, getAuthHeaders());
      } else {
        await axios.post('/api/students', formData, getAuthHeaders());
      }
      navigate('/');
    } catch (error) {
      handleError(error);
      if (error.response?.status !== 401) {
        alert('Error saving student. Make sure Roll Number is unique.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? 'Edit Student' : 'Add New Student'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Roll Number</label>
          <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Course</label>
          <input type="text" name="course" value={formData.course} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Year</label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn">Save</button>
        <button type="button" className="btn btn-danger" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
}

export default StudentForm;
