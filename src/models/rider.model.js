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
      profilePicUrl: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/bondly-2ff55.appspot.com/o/default-profile-image.jpg?alt=media&token=ee74f8f0-d6ed-4d30-ba3a-f89e5cf63eb3"
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