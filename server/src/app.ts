import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import leadRoutes from "./routes/lead.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/users", userRoutes);

app.get("/", (_req, res) => {
  res.send("API Running");
});

export default app;