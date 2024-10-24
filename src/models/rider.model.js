import mongoose from "mongoose"
import { Insurance, License } from "./common.models.js";

const Schema = mongoose.Schema;

const RiderSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "user"
  },
  driverDetails: {
    type: {
      name: {
        type: String,
        required: true
      },
      contact: {
        type: String,
        required: true
      },
      bio: {
        type: String,
        required: true
      },
      birthDate: {
        type: Date,
        required: true
      },
      gender: {
        type: String,
        enum: ["male", "female"],
        required: true
      }
    }
  },
  license: License,
  insurance: Insurance,
  accountStatus: {
    type: String,
    enum: ["driverDetails", "license", "insurance", "pending", "verified"],
    required: true,
    default: "driverDetails"
  },
  rate: {
    type: Number
  }
});

let Rider = mongoose.model('Rider', RiderSchema);

export default Rider