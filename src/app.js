const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('./middlewares/error');
const { apiLimiter } = require('./middlewares/rateLimiter');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const reviewRoutes = require('./routes/review.routes');
const cartRoutes = require('./routes/cart.routes');
const addressRoutes = require('./routes/address.routes');
const deliveryZoneRoutes = require('./routes/deliveryZone.routes');
const couponRoutes = require('./routes/coupon.routes');
const notificationRoutes = require('./routes/notification.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const aiRoutes = require('./routes/ai.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const settingRoutes = require('./routes/setting.routes');
const auditLogRoutes = require('./routes/auditLog.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const faqRoutes = require('./routes/faq.routes');
const uploadRoutes = require('./routes/upload.routes');
const knowledgeBaseRoutes = require('./routes/knowledgeBase.routes');
const publicKnowledgeBaseRoutes = require('./routes/publicKnowledgeBase.routes');
const adminRoutes = require('./routes/admin.routes');
const systemRoutes = require('./routes/system.routes');
const devRoutes = require('./routes/dev.routes');
const userRoutes = require('./routes/user.routes');
const checkoutRoutes = require('./routes/checkout.routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/delivery-zones', deliveryZoneRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin/knowledge-base', knowledgeBaseRoutes);
app.use('/api/knowledge-base', publicKnowledgeBaseRoutes);
app.use('/api/admin/admins', adminRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/dev', devRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checkout', checkoutRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
