import jwt from "jsonwebtoken";

const jwtAuthMiddleware = (excludedRoutes = []) => {
  return (req, res, next) => {
    if (excludedRoutes.some(route => req.path.startsWith(route))) {
      return next();
    }

    const token = req.cookies?.authToken;
    if (!token) {
      if (req.headers.accept?.includes("application/json")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
      }
      return res.redirect("/login");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      if (req.headers.accept?.includes("application/json")) {
        return res.status(401).json({ error: "Invalid or expired token." });
      }
      return res.redirect("/login");
    }
  };
};

export default jwtAuthMiddleware;
