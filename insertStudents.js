const mongoose = require('mongoose');
const students = require('./db.json').students;  // Make sure db.json in same folder

mongoose.connect('mongodb://localhost:27017/attendance_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const studentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  mobile: String,
  photo: String,
});
const Student = mongoose.model('Student', studentSchema);

async function insert() {
  try {
    await Student.deleteMany({});  // Clear old data
    await Student.insertMany(students);
    console.log('✅ Students inserted successfully');
  } catch (e) {
    console.error('❌ Error inserting students:', e);
  } finally {
    mongoose.disconnect();
  }
}

insert();
