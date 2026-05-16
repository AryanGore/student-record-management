import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function StudentList({ setAuth }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleError = (error) => {
    console.error(error);
    if (error.response?.status === 401) {
      setAuth(false);
      localStorage.removeItem('token');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students', getAuthHeaders());
      setStudents(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`/api/students/${id}`, getAuthHeaders());
        fetchStudents();
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <div>
      <h2>Student Records</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Course</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.rollNumber}</td>
              <td>{student.course}</td>
              <td>{student.year}</td>
              <td>
                <Link to={`/edit/${student._id}`} className="btn">Edit</Link>
                <button onClick={() => deleteStudent(student._id)} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
