import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
  // console.log("AUTH HEADER RECEIVED:", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    const token =
      authHeader && authHeader.startsWith("Bearer")
        ? authHeader.replace("Bearer", "").trim()
        : null;

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// export const protect = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     const token =
//       authHeader && authHeader.startsWith("Bearer")
//         ? authHeader.replace("Bearer", "").trim()
//         : null;

//     if (!token) {
//       return res.status(401).json({ msg: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ msg: "Invalid or expired token" });
//   }
// };

export const adminProtect = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin access only" });
  }
  next();
};
