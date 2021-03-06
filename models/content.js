/* This module exports the Content schema */
const mongoose = require('mongoose');
const Populate = require('../utils/autoPopulate');

const { Schema } = mongoose;

const ContentSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  priceInWei: { type: Number, required: true },
}, { timestamps: { createdAt: 'created_at' } });

ContentSchema
  .pre('findOne', Populate('author'))
  .pre('find', Populate('author'))
  .pre('findById', Populate('author'));

module.exports = mongoose.model('Content', ContentSchema);
