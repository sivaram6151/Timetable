const mongoose = require('mongoose');

delete require.cache[require.resolve('./Teacher')];  

// Check if the model already exists, otherwise define it
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  teacherId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  department: { type: String, required: true },
}));

module.exports = { Teacher };
