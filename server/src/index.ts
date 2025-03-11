import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/authMiddleware";
/* ROUTE IMPORTS */
import tenantRoute from "./routes/tenantRoute";
import managerRoute from "./routes/managerRoute";
import propertyRoute from "./routes/propertyRoute";
import leaseRoute from "./routes/leaseRoute";
import applicationRoute from "./routes/applicationRoute";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Hello from home route");
});

app.use("/applications", applicationRoute);
app.use("/properties", propertyRoute);
app.use("/tenant", authMiddleware(["tenant"]), tenantRoute);
app.use("/manager", authMiddleware(["manager"]), managerRoute);
app.use("/leases", authMiddleware(["manager", "tenant"]), leaseRoute);

/* SERVER */
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
