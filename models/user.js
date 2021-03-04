/* This module exports the user schema */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  password: { type: String, select: false },
  username: { type: String, required: true },
  email: { type: String, required: true },
  publicEthAddress: { type: String, required: true },
  content: [{ type: Schema.Types.ObjectId, ref: 'Content' }],
  txReceipt: [{ type: Schema.Types.ObjectId, ref: 'TxReceipt' }],
}, { timestamps: { createdAt: 'created_at' } });

// Must use function here! ES6 => functions do not bind this!
// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  // ENCRYPT PASSWORD
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (_err, salt) => {
    bcrypt.hash(user.password, salt, (_errSecond, hash) => {
      user.password = hash;
      next();
    });
  });
  return null;
});

// Need to use function to enable this.password to work.
// eslint-disable-next-line func-names
UserSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
