import jwt from "jsonwebtoken";
//auth
const auth = async (req, res, next) => {
  try {
    console.log(req);
    const authHeader = req.header("Authorization");
    const token =
      req.cookies?.token ||
      req.body?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null);
 
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is not verified",
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      //verification - issue
      return res.status(400).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Someting went wrong while validating the tokenn ",
    });
  }
};

//isStudent
const isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student")
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Students Only",
      });
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An Error Occured",
    });
  }
};

//isInstructor
const isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor")
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Instructor Only",
      });
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An Error Occured",
    });
  }
};

//isAdmin
const isAdmin = async (req, res, next) => {
  try {
    console.log(req.user);
    console.log(req.user.accountType, "hi");
    if (req.user.accountType !== "Admin")
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin Only",
      });
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An Error Occured",
    });
  }
};
export { auth, isInstructor, isAdmin, isStudent };
