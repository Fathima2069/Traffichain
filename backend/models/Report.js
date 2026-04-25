const reportSchema = new mongoose.Schema({
  username: String,   // ✅ ADD THIS
  vehicleNumber: String,
  location: String,
  description: String,
  image: String,
  status: { type: String, default: "Pending" },
  fineAmount: { type: Number, default: 50 },
});