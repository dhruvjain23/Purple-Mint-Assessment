import mongoose, {Schema} from "mongoose";

const driverSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  shift_hours: { 
    type: Number,
    required: true 
  },
  past_week_hours: { 
    type: [Number], 
    required: true 
  }  // Array of 7 numbers
});

const Driver = mongoose.model('Driver', driverSchema);

export { Driver };