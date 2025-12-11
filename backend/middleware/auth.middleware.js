const jwt = require('jsonwebtoken');

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
    // const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    // if (!token) return res.status(401).json({ message: "Unauthorized: No token provided." });

    // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //     if (err) return res.status(403).json({ message: "Forbidden: Invalid or expired token." });
    //     req.user = user;
    //     next();
    // });

    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = req.cookies?.accessToken || tokenFromHeader;
  
    // Nếu có token, dùng jwt để xác thực
    if (token && typeof token === 'string') {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (err) {
        console.error("JWT verification failed:", err.message);
        // Nếu token không hợp lệ, fallback sang session nếu có
        // if (req.session?.user) {
        //   req.user = req.session.user;
        //   return next();
        // }
        // return res.status(403).json({ message: "Forbidden: Invalid or expired token." });
      }
    }
    if (req.user) {
      return next(); // đã có req.user từ passport.deserializeUser
  }
    // Nếu không có token nhưng có session (đăng nhập Google)
    if (req.session?.user) {
      req.user = req.session.user;
      return next();
    }
  
    // Không có token cũng không có session
    return res.status(401).json({ message: "Unauthorized: No token or session." });
};

// Middleware to check Admin role
// exports.verifyAdmin = (req, res, next) => {
//     exports.verifyToken(req, res, (err) => {
//         if (err) return res.status(403).json({ message: "Forbidden: Invalid or expired token." });

//         if (!req.user.isAdmin) {
//             return res.status(403).json({ message: "Forbidden: You do not have admin privileges." });
//         }
//         next();
//     });
// };
exports.verifyAdmin = [
  exports.verifyToken,
  (req, res, next) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Forbidden: You do not have admin privileges." });
    }
    next();
  }
];
