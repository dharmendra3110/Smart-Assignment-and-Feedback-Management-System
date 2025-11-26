import jwt from "jsonwebtoken";
const SECRET = "safms_secret_key";

export function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// Express middleware to protect routes. Expects Authorization: Bearer <token>
export function auth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ msg: "Invalid or expired token" });

  // attach minimal user info to request
  req.user = { id: payload.id, role: payload.role };
  next();
}
