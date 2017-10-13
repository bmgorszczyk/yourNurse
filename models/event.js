const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
const SchemaTypes = mongoose.Schema.Types;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  nurseName: {
    type: String,
    required: true
  },
  shiftTime: {
    type: SchemaTypes.Double,
    required: true
  },
  shiftFunction: {
    type: String,
    required: false
  },
  monthYear: {
    type: String,
    required: true
  },
  nurseID: {
    type: String,
    required: true
  }

});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;
