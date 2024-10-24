import mongoose from "mongoose"
import { Location } from "./common.models.js";

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
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending"
  },
  riderReview: {
    type: {
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true
      }
    }
  },
  ownerReview: {
    type: {
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true
      }
    }
  }
});

let Ride = mongoose.model('Ride', RideSchema);

export default Ride