const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  private: {
    type: Boolean,
    default: false
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    }
  ],
  imageURL: {
    type: String,
    required: false
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    }
  ],
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
})

UserSchema.pre('save', function(next) {
  let user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

let User = mongoose.model('Users', UserSchema)

module.exports = User
