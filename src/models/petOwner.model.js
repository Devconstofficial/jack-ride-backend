import mongoose from "mongoose"

const Schema = mongoose.Schema;

const PetOwnerSchema = new Schema({
  user:{
    type: Schema.ObjectId,
    ref: "User",
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  }
});

let PetOwner = mongoose.model('PetOwner', PetOwnerSchema);

export default PetOwner