const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimeTableSchema = new Schema({
  data: {
    type: Array,
    required: true
  },
  dateSaved: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("TimeTable", TimeTableSchema);
