const { GoogleGenAI } = require('@google/genai');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Product = require('../models/Product');
const Category = require('../models/Category');
const FAQ = require('../models/FAQ');
const Setting = require('../models/Setting');
const ApiError = require('../utils/apiError');

function buildSystemPrompt(setting, categories, products, faqs) {
  let prompt = `You are an AI assistant for ${setting.restaurantName?.en || 'the restaurant'}.
Answer questions about the menu, prices, availability, and restaurant information.
Be helpful, friendly, and concise. Respond in the same language as the user's message (English or Arabic).

--- RESTAURANT INFO ---
Name: ${setting.restaurantName?.en || 'N/A'} / ${setting.restaurantName?.ar || 'N/A'}
Working Hours: ${setting.workingHours || 'N/A'}
Contact Email: ${setting.supportEmail || 'N/A'}
Contact Phone: ${setting.supportPhone || 'N/A'}
Currency: ${setting.currency || 'EGP'}
Default Language: ${setting.defaultLanguage || 'en'}

--- MENU ---`;

  const grouped = {};
  for (const cat of categories) {
    grouped[cat._id] = cat.name?.en || cat.name?.ar || 'Uncategorized';
  }

  for (const product of products) {
    const catId = product.category?._id || product.category;
    const catName = catId ? (grouped[catId] || 'General') : 'General';
    const price = product.discountedPrice || product.price;
    const status = product.available ? 'Available' : 'Unavailable';
    prompt += `\n${catName} - ${product.name?.en || product.name?.ar}: ${price} ${setting.currency || 'EGP'} (${status})`;
  }

  if (faqs.length > 0) {
    prompt += '\n\n--- FAQS ---';
    for (const faq of faqs) {
      prompt += `\nQ: ${faq.question?.en || faq.question?.ar}`;
      prompt += `\nA: ${faq.answer?.en || faq.answer?.ar}\n`;
    }
  }

  return prompt;
}

async function chat(userId, message, conversationId) {
  const setting = await Setting.findOne();
  if (!setting || !setting.aiEnabled) {
    throw new ApiError(400, 'AI assistant is disabled');
  }

  let conversation;
  if (conversationId) {
    conversation = await Conversation.findOne({ _id: conversationId, user: userId });
    if (!conversation) throw new ApiError(404, 'Conversation not found');
  } else {
    conversation = await Conversation.create({ user: userId });
  }

  await Message.create({ conversation: conversation._id, role: 'user', content: message });

  const [categories, products, faqs] = await Promise.all([
    Category.find().sort({ sortOrder: 1 }).lean(),
    Product.find({}).populate('category', 'name').lean(),
    FAQ.find({ active: true }).lean(),
  ]);

  const systemPrompt = buildSystemPrompt(setting, categories, products, faqs);

  const rawHistory = await Message.find({ conversation: conversation._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  rawHistory.reverse();

  const contents = [];
  for (const msg of rawHistory) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, 'AI service not configured. Please set GEMINI_API_KEY in .env');
  }

  const client = new GoogleGenAI({ apiKey });

  let reply;
  try {
    const result = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
      contents,
    });
    reply = result.text;
  } catch (err) {
    throw new ApiError(500, 'AI service unavailable. Please try again.');
  }

  await Message.create({ conversation: conversation._id, role: 'assistant', content: reply });

  return { reply, conversationId: conversation._id };
}

async function getConversations(userId) {
  const conversations = await Conversation.find({ user: userId })
    .sort({ updatedAt: -1 })
    .lean();

  const result = [];
  for (const conv of conversations) {
    const lastMessage = await Message.findOne({ conversation: conv._id })
      .sort({ createdAt: -1 })
      .lean();
    result.push({
      _id: conv._id,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      lastMessage: lastMessage ? lastMessage.content : null,
    });
  }

  return result;
}

async function getMessages(conversationId, userId) {
  const conversation = await Conversation.findOne({ _id: conversationId, user: userId });
  if (!conversation) throw new ApiError(404, 'Conversation not found');

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .lean();

  return messages;
}

async function removeConversation(conversationId, userId) {
  const conversation = await Conversation.findOneAndDelete({ _id: conversationId, user: userId });
  if (!conversation) throw new ApiError(404, 'Conversation not found');

  await Message.deleteMany({ conversation: conversationId });

  return conversation;
}

module.exports = {
  chat,
  getConversations,
  getMessages,
  removeConversation,
};
