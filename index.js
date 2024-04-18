import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
// Security packages
import helmet from "helmet";
import dbConnection from "./dbconfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";
import Users from "./models/userModel.js";

dotenv.config();

const __dirname = path.resolve();

const app = express();

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "views/build")));

const PORT = process.env.PORT || 8800;

// Connect to the database
dbConnection()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);

// Error middleware
app.use(errorMiddleware);

// Define a GET endpoint to fetch all users
app.get('/api/users', async(req, res) => {
  try {
    const user = await Users.find();
    console.log(user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
