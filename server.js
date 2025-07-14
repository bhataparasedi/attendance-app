require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Uploads folder setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Serve uploads statically
app.use('/uploads', express.static(uploadDir));

// Serve other static files (e.g. frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.params.id + ext);
  }
});
const upload = multer({ storage: storage });

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

// Upload photo route
app.post('/api/students/:id/uploadPhoto', upload.single('photo'), async (req, res) => {
  try {
    const studentId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    const updatedStudent = await Student.findOneAndUpdate(
      { id: studentId },
      { photo: photoUrl },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Photo uploaded successfully', photoUrl });
  } catch (err) {
    console.error('Error uploading photo:', err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Get attendance by date or all
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
