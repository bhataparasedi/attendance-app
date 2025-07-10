require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // JSON body parsing

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Define Mongoose Schemas and Models

// Student schema
const studentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  mobile: String,
  photo: String, // URL or base64 string for photo
});

const Student = mongoose.model('Student', studentSchema);

// Attendance schema
const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // yyyy-mm-dd format
  records: { type: Map, of: String }, // { studentId: timeString }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// API routes

// Get all students
app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
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

// Update student by id
app.put('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Student.findOneAndUpdate({ id }, req.body);
    res.json({ message: 'Student updated' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Student.findOneAndDelete({ id });
    res.json({ message: 'Student deleted' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get attendance by date
app.get('/api/attendance', async (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  const attendance = await Attendance.findOne({ date });
  res.json(attendance ? attendance : {});
});

// Save or update attendance for a date
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

// Update attendance by id (for PUT)
app.put('/api/attendance/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Attendance.findByIdAndUpdate(id, req.body);
    res.json({ message: 'Attendance updated' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Serve frontend (if any)
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
