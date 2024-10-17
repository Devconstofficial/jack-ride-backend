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
  }
});

let Owner = mongoose.model('Owner', OwnerSchema);

export default Owner