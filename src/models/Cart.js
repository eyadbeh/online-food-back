const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestId: { type: String, default: null },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 }, { sparse: true });
cartSchema.index({ guestId: 1 }, { sparse: true });

cartSchema.pre('save', function () {
  if (!this.user && !this.guestId) {
    throw new Error('Cart must have either user or guestId');
  }
});

module.exports = mongoose.model('Cart', cartSchema);
