import mongoose from "mongoose"

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    default: null
  },
  roles: {
    type: [{
        type:String,
        enum: ["owner", "rider"],
        required: true
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

let User = mongoose.model('User', UserSchema);

export default User