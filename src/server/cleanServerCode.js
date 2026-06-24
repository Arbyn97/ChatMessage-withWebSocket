const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { /* socket config */ });
const { MongoClient } = require('mongodb');

let usersCollection; // متغیر گلوبال برای استفاده بعد

// میدل‌ورها
app.use(express.json());

// مسیر لاگین
app.post('/api/login', (req, res) => handleLogin(req, res, usersCollection));

// تابع اصلی
async function main() {
  const client = new MongoClient('mongodb connection string');
  await client.connect();

  const db = client.db("mymessages");
  usersCollection = db.collection("registery"); // مقداردهی متغیر گلوبال

  console.log("✅ MongoDB connected.");
}

// تابع جدا برای login
async function handleLogin(req, res, usersCollection) {
  const { id, password } = req.body;
  try {
    const user = await usersCollection.findOne({ Id: id, Password: password });

    if (user) {
      res.json({ message: 'ورود موفقیت‌آمیز بود!' });
    } else {
      res.status(400).json({ message: 'ای دی یا پسورد اشتباه است.' });
    }
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: 'خطای سرور' });
  }
}

// اجرای main و سپس روشن کردن سرور
main()
  .then(() => {
    server.listen(4000, () => {
      console.log("🚀 Server is running on port 4000");
    });
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Failed:", err);
  });
//تابع main رو که برای پیام ها بود از تابع فرم  اعتبار سنجی جدا کردم
