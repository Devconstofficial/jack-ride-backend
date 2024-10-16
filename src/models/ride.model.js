import mongoose from "mongoose"
import { Location } from "./common.models";

const Schema = mongoose.Schema;

const RideSchema = new Schema({
  owner:{
    type: Schema.ObjectId,
    ref: "owner",
    required: true,
  },
  rider:{
    type: Schema.ObjectId,
    ref: "rider",
    required: true
  },
  leavingFrom: {
    type: Location,
    required: true
  },
  goingTo: {
    type: Location,
    required: true
  },
  hours:{
    type: Number,
    required: true
  },
  dateForBooking:{
    type: Date,
    required: true
  },
  acceptedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending"
  }
});

let Ride = mongoose.model('Ride', RideSchema);

export default Ride