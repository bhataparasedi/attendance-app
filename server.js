require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas and Models
const studentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  mobile: String,
  photo: String,
});
const Student = mongoose.model('Student', studentSchema);

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // yyyy-mm-dd
  records: { type: Map, of: String },     // { studentId: timeString }
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

// API routes

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add new student
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ message: 'Student added' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  try {
    await Student.findOneAndUpdate({ id: req.params.id }, req.body);
    res.json({ message: 'Student updated' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Student deleted' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get attendance by date or all
// ✅ FIXED: Get attendance (by date or all)
app.get('/api/attendance', async (req, res) => {
  const date = req.query.date;

  try {
    if (date) {
      const attendance = await Attendance.findOne({ date });
      return res.json(attendance ? [attendance] : []);
    } else {
      const allAttendance = await Attendance.find();
      return res.json(allAttendance);
    }
  } catch (e) {
    console.error("❌ Error in GET /api/attendance:", e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Add or update attendance
app.post('/api/attendance', async (req, res) => {
  try {
    const { date, records } = req.body;
    let attendance = await Attendance.findOne({ date });

    if (attendance) {
      attendance.records = records;
    } else {
      attendance = new Attendance({ date, records });
    }

    await attendance.save();
    res.json({ message: 'Attendance saved' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update attendance by ID
app.put('/api/attendance/:id', async (req, res) => {
  try {
    await Attendance.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Attendance updated' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Serve frontend (static files served from /public)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
