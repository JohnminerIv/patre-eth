/* This module exports the txReceipt schema */
const mongoose = require('mongoose');
const Populate = require('../utils/autoPopulate');

const { Schema } = mongoose;

const TxReceiptSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  txHash: { type: String, required: true },
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  verified: { type: Schema.Types.Boolean, required: true },
}, { timestamps: { createdAt: 'created_at' } });

TxReceiptSchema
  .pre('findOne', Populate('owner'))
  .pre('find', Populate('owner'))
  .pre('findById', Populate('owner'))
  .pre('findOne', Populate('contentId'))
  .pre('find', Populate('contentId'))
  .pre('findById', Populate('contentId'));

module.exports = mongoose.model('TxReceipt', TxReceiptSchema);
