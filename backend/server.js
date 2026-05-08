const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = 8000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("io", io);
app.use(express.urlencoded({ extended: true }));

/* ---------------- SOCKET ---------------- */
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);
});

/* ---------------- MONGODB ---------------- */
mongoose.connect("mongodb://127.0.0.1:27017/traffichain")
  .then(() => {
    console.log("MongoDB Connected ✅");
    createUsers();
  })
  .catch(err => console.log(err));

/* ---------------- MODELS ---------------- */
const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String,
  role: String,
}));

// ✅ FIXED VEHICLE MODEL (IMPORTANT)
const Vehicle = mongoose.model("Vehicle", new mongoose.Schema({
  username: String,
  vehicleNumber: String,
  vehicleType: String,
  ownerName: String,
  model: String,
  color: String
}));

const Violation = mongoose.model("Violation", new mongoose.Schema({
  username: String,
  vehicleNumber: String,
  location: String,
  description: String,
  image: String,
  status: { type: String, default: "Pending" },
  fineAmount: { type: Number, default: 100 },
  deadline: Date
}, { timestamps: true }));

const Report = mongoose.model("Report", new mongoose.Schema({
  username: String,
  vehicleNumber: String,
  location: String,
  description: String,
  image: String,
  status: { type: String, default: "Pending" },
}));

/* ---------------- FILE UPLOAD ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ---------------- LOGIN ---------------- */
app.post("/api/login", async (req, res) => {
  const { username, password, role } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (user.role !== role)
    return res.status(400).json({ message: "Invalid role" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

  res.json({ username: user.username, role: user.role });
});

/* ---------------- VEHICLES ---------------- */
// ✅ KEEP ONLY ONE ROUTE (FIXED)
app.post("/api/vehicles", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const vehicle = new Vehicle(req.body);
    await vehicle.save();

    res.json(vehicle);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving vehicle" });
  }
});

app.get("/api/vehicles/:username", async (req, res) => {
  const data = await Vehicle.find({ username: req.params.username });
  res.json(data);
});

/* ---------------- REPORTS ---------------- */
app.post("/api/reports", upload.single("image"), async (req, res) => {
  const report = new Report({
    ...req.body,
    image: req.file ? req.file.filename : null,
  });

  await report.save();

  req.app.get("io").emit("newReport", {
    message: "🚫 New report submitted",
  });

  res.json({ message: "Report submitted" });
});

app.get("/api/reports", async (req, res) => {
  res.json(await Report.find());
});

app.get("/api/reports/:username", async (req, res) => {
  res.json(await Report.find({ username: req.params.username }));
});

/* ---------------- VIOLATIONS ---------------- */
app.post("/api/violation", upload.single("image"), async (req, res) => {
  try {
    const now = new Date();
    const deadline = new Date();
    deadline.setDate(now.getDate() + 7);

    const violation = new Violation({
      ...req.body,
      image: req.file ? req.file.filename : null,
      deadline
    });

    await violation.save();

    req.app.get("io").emit("newViolation", {
      message: "🚨 New violation added",
    });

    res.json({ message: "Violation added" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding violation" });
  }
});

app.get("/api/violations", async (req, res) => {
  const data = await Violation.find();
  const today = new Date();

  const updated = data.map(v => {
    let finalAmount = v.fineAmount;

    if (v.status !== "Paid" && v.deadline && today > v.deadline) {
      finalAmount += 100;
    }

    return { ...v._doc, finalAmount };
  });

  res.json(updated);
});

app.get("/api/violations/:username", async (req, res) => {
  const data = await Violation.find({ username: req.params.username });
  const today = new Date();

  const updated = data.map(v => {
    let finalAmount = v.fineAmount;

    if (v.status !== "Paid" && v.deadline && today > v.deadline) {
      finalAmount += 100;
    }

    return { ...v._doc, finalAmount };
  });

  res.json(updated);
});

app.put("/api/violations/:id", async (req, res) => {
  await Violation.findByIdAndUpdate(req.params.id, req.body);

  req.app.get("io").emit("statusUpdate", {
    message: "🔄 Status updated",
  });

  res.json({ message: "Updated" });
});

app.put("/api/violation/pay/:id", async (req, res) => {
  await Violation.findByIdAndUpdate(req.params.id, { status: "Paid" });

  req.app.get("io").emit("paymentSuccess", {
    message: "✅ Payment successful",
  });

  res.json({ message: "Paid" });
});

app.delete("/api/violations/:id", async (req, res) => {
  await Violation.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ---------------- STATS ---------------- */
app.get("/api/stats", async (req, res) => {
  const total = await Violation.countDocuments();
  const paid = await Violation.countDocuments({ status: "Paid" });
  const pending = await Violation.countDocuments({ status: "Pending" });

  const paidList = await Violation.find({ status: "Paid" });
  const revenue = paidList.reduce((sum, v) => sum + v.fineAmount, 0);

  res.json({ total, paid, pending, revenue });
});

/* ---------------- DEFAULT USERS ---------------- */
async function createUsers() {
  const users = [
    { username: "admin1", password: "admin123", role: "admin" },
    { username: "user1", password: "user123", role: "user" },
  ];

  for (let u of users) {
    const exists = await User.findOne({ username: u.username });
    if (!exists) {
      const hash = await bcrypt.hash(u.password, 10);
      await new User({ ...u, password: hash }).save();
      console.log(`${u.username} created`);
    }
  }
}

/* ---------------- START ---------------- */
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);