import mongoose from "mongoose"

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  phone: {
    countryCode: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true,
      match: [/^\d+$/, 'Please enter a valid phone number']
    }
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: null
  },
  roles: {
    type: [{
        type:String,
        enum: ["petOwner", "petCarer"]
    }],
    required: [true, 'Roles field is required'],
    validate: {
      validator: function (v) {
        // Ensure the array has at least one element
        return v && v.length > 0;
      },
      message: 'Roles must contain at least one item'
    }
  }
});

// Create a compound index to ensure unique phone numbers (countryCode + number)
UserSchema.index({ 'phone.countryCode': 1, 'phone.number': 1 }, { unique: true });

let User = mongoose.model('User', UserSchema);

export default User