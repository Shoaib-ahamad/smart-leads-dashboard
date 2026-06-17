import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import leadRoutes from "./routes/lead.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

app.use("/api/leads", leadRoutes);

app.get("/", (_req, res) => {
  res.send("API Running");
});

export default app;