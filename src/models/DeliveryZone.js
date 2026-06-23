const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    fee: { type: Number, required: true, min: 0 },
    estimatedMinutes: { type: Number, min: 0 },
    active: { type: Boolean, default: true },
    isDefaultFallback: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);
