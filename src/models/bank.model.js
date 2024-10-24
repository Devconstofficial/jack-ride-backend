import mongoose from "mongoose"

const Schema = mongoose.Schema;

const bankAccountSchema = new Schema({
  user:{
    type: Schema.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  bankName: {
    type: String,
    required: true
  },
  bankAccountNumber: {
    type: String,
    required: true
  },
  bankUserName: {
    type: String,
    required: true
  }
});

let BankAccount = mongoose.model('BankAccount', bankAccountSchema);

export default BankAccount