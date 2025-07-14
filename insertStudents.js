const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_db', {
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
  { "id": "BYT/RSA-01/2025_26/1", "name": "Aadrsh Tandan", "mobile": "7974341601", "photo": "https://i.postimg.cc/763xmNgf/20-Aadrsh-Tandan-1.jpg" },
  { "id": "BYT/RSA-01/2025_26/2", "name": "Aradhna Kurre", "mobile": "6262635774", "photo": "https://i.postimg.cc/kggvC1GP/19-Aradhna-Kurre.jpg" },
  { "id": "BYT/RSA-01/2025_26/3", "name": "Akash Mishra", "mobile": "9131581874", "photo": "https://i.postimg.cc/x8QL4gh7/18-Akash-Mishra.jpg" },
  { "id": "BYT/RSA-01/2025_26/4", "name": "Anamika Kol", "mobile": "9343554306", "photo": "https://i.postimg.cc/jjLVD48G/17-Anamika-Kol.jpg" },
  { "id": "BYT/RSA-01/2025_26/5", "name": "Pooja Kumari Dewangan", "mobile": "8878458745", "photo": "https://i.postimg.cc/DwwHNcK8/10-Pooja-Kumari-Dewangan.jpg" },
  { "id": "BYT/RSA-01/2025_26/6", "name": "Garima Singh", "mobile": "8889970858", "photo": "https://i.postimg.cc/rpbBxR3z/15-Garima-Singh.jpg" },
  { "id": "BYT/RSA-01/2025_26/7", "name": "Jhamni Bhatt", "mobile": "9202230430", "photo": "https://i.postimg.cc/LX1rT6FD/14-Jhamni-Bhatt.jpg" },
  { "id": "BYT/RSA-01/2025_26/8", "name": "Kuldeep Sahu", "mobile": "7566002928", "photo": "https://i.postimg.cc/Df194Zgy/13-Kuldeep-Sahu.jpg" },
  { "id": "BYT/RSA-01/2025_26/9", "name": "Manish Dahariya", "mobile": "6265113720", "photo": "https://i.postimg.cc/gjyQCSJ6/12-Manish-Dahariya-1.jpg" },
  { "id": "BYT/RSA-01/2025_26/10", "name": "Nandhni Tandan", "mobile": "6267443636", "photo": "https://i.postimg.cc/MHJgr2WS/11-Nandani-Tandan.jpg" },
  { "id": "BYT/RSA-01/2025_26/11", "name": "Pooja Kumari Dewangan", "mobile": "8878458745", "photo": "https://i.postimg.cc/DwwHNcK8/10-Pooja-Kumari-Dewangan.jpg" },
  { "id": "BYT/RSA-01/2025_26/12", "name": "Pushpa Kurre", "mobile": "9340098852", "photo": "https://i.postimg.cc/bN8KxhC0/9-Pushpa-kurre-1.jpg" },
  { "id": "BYT/RSA-01/2025_26/13", "name": "Purnima Tandan", "mobile": "6265997055", "photo": "https://i.postimg.cc/c4mPTb2p/8-Purnima-Tandan.jpg" },
  { "id": "BYT/RSA-01/2025_26/14", "name": "Rabiya Basree", "mobile": "8435679817", "photo": "https://i.postimg.cc/htZ6R7SM/7-Rabiya-Basree-1.jpg" },
  { "id": "BYT/RSA-01/2025_26/15", "name": "Rani Laxmi Sahu", "mobile": "9644742772", "photo": "https://i.postimg.cc/KzBHTqts/6-Rani-laxmi-Sahu-1.jpg" },
  { "id": "BYT/RSA-01/2025_26/16", "name": "Rashmi Masih", "mobile": "9691574110", "photo": "https://i.postimg.cc/DzWDvy0h/5-Rashmi-Masih.jpg" },
  { "id": "BYT/RSA-01/2025_26/17", "name": "Ranjana Mahilange", "mobile": "9691469290", "photo": "https://i.postimg.cc/HLfNVD8y/4-Ranjana-Mahilange-1.jpg" },
  { "id": "BYT/RSA-01/2025_26/18", "name": "Sandhya Ghritre", "mobile": "8871316590", "photo": "https://i.postimg.cc/KjbsDPNc/3-Sandhya-Ghritre-1.jpg" },
  { "id": "BYT/RSA-01/2025_26/19", "name": "Soni Dhruw", "mobile": "7869186194", "photo": "https://i.postimg.cc/jdZkyJJK/2-Soni-Dhruw.jpg" },
  { "id": "BYT/RSA-01/2025_26/20", "name": "Varsha Manhare", "mobile": "9202649805", "photo": "https://i.postimg.cc/66VP5PW8/1-Varsha-Manhare.jpg" }
];

async function insert() {
  try {
    await Student.deleteMany({});
    await Student.insertMany(students);
    console.log('Students inserted successfully');
  } catch (e) {
    console.error('Error inserting students:', e);
  } finally {
    mongoose.disconnect();
  }
}

insert();
