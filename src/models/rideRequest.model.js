import mongoose from "mongoose"
import { Location } from "./common.models";

const Schema = mongoose.Schema;

const RideRequestSchema = new Schema({
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
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

let RideRequest = mongoose.model('RideRequest', RideRequestSchema);

export default RideRequest