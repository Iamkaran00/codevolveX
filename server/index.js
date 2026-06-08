import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import profileRoute from "./routes/profile.routes.js";
import courseRoute from "./routes/course.routes.js";
import contactRoute from "./routes/contact.routes.js";
import paymentRoute from "./routes/payment.routes.js";
import cookieParser from "cookie-parser";
import  dbconnection from "./config/database.js";
import cors from "cors";
dotenv.config({
  path: "./.env",
});
const app = express();
const PORT = process.env.PORT || 5501;
//db connection

dbconnection();
app.use(express.urlencoded({ limit: '4000mb', extended: true }));
app.use(express.json({limit : "4000mb"}));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/payment", paymentRoute);
app.use('/api/v1/contact' , contactRoute);
//default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

app.listen(PORT, () => {
  console.log("App is running at PORT ⚙️", PORT);
});
