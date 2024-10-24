import mongoose from "mongoose"

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  imageUrl:{
    type: String
  },
  action: {
    type: String, // Stores data specific to the action
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId, // reference to User schema
    ref: 'User',
    required: true,
  },
  createdAt:{
    type: Date,
    required: true,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification