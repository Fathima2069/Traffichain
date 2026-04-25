router.get("/stats", authMiddleware, (req, res) => {
  res.json({ message: "Protected data" });
});