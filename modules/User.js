const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  car: {
    type: {
      brand: {
        type: String,
        enum: ['BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda'],
        required: true,
      },
      model: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  phone: {
    type: {
      countryCode: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
