import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (username === "admin" && password === "password") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || "SECRET123", { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
