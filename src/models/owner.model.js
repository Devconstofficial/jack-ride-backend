import mongoose from "mongoose"
import { Car, Insurance, License, LicensePlate } from "./common.models.js";

const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "user"
  },
  personalDetails: {
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
  vin: String,
  insurance: Insurance,
  licensePlate: LicensePlate,
  hasCar: {
    type: Boolean
  },
  car:Car,
  accountStatus: {
    type: String,
    enum: ["ownCar", "personalDetails", "license", "vin", "licensePlate", "insurance", "car", "pending", "verified"],
    required: true,
    default: "ownCar"
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  }
});

let Owner = mongoose.model('Owner', OwnerSchema);

export default Owner