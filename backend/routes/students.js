const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const student = new Student({
    name: req.body.name,
    rollNumber: req.body.rollNumber,
    course: req.body.course,
    year: req.body.year
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (req.body.name) student.name = req.body.name;
    if (req.body.rollNumber) student.rollNumber = req.body.rollNumber;
    if (req.body.course) student.course = req.body.course;
    if (req.body.year) student.year = req.body.year;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await student.deleteOne();
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
