const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NurseSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  tel: {
    type: Number
  }
});

const Nurse = mongoose.model('nurse', NurseSchema);

module.exports = Nurse;
