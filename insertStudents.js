const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/attendance_db', {  // apna MongoDB URI use karen
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

const students = [
  { id: "BYT/RSA-01/2025_26/1", name: "Aadrsh Tandan", mobile: "7974341601", photo: "https://i.postimg.cc/763xmNgf/20-Aadrsh-Tandan-1.jpg" },
  { id: "BYT/RSA-01/2025_26/2", name: "Aradhna Kurre", mobile: "6262635774", photo: "https://i.postimg.cc/kggvC1GP/19-Aradhna-Kurre.jpg" },
  // Apna baki data bhi yahan paste karen
];

async function insert() {
  try {
    await Student.deleteMany({}); // Optional: purana data clear karna ho toh
    await Student.insertMany(students);
    console.log('Students inserted successfully');
  } catch (e) {
    console.error('Error inserting students:', e);
  } finally {
    mongoose.disconnect();
  }
}

insert();
