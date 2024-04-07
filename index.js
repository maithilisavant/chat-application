// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import cors from 'cors';
// import dotenv from 'dotenv';
// import multer from "multer";
// import helmet from "helmet";
// import morgan from "morgan";
// import path from "path";
// import { fileURLToPath } from "url";
// import { register } from "./controllers/auth.js";
// import { createPost } from "./controllers/posts.js"
// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/users.js";
// import postRoutes from "./routes/posts.js";
// import { verifyToken } from "./middleware/auth.js";
// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts} from './data/index.js';

// /* configurations */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
// app.use(morgan("common"));
// app.use(bodyParser.json({limit:"30mb", extended: true}));
// app.use(bodyParser.urlencoded({limit:"30mb", extended: true}));
// app.use(cors());
// app.use("/assets",express.static(path.join(__dirname, "public/assets")));

// // File storage

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, "public/assets");
//     },
//     filename: function (req, file, cb){
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({storage});

// //routes with files
// app.post("/auth/register", upload.single("picture"), register);
// app.post("/posts", verifyToken, upload.single("picture"), createPost);

// // routes
// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/posts", postRoutes);

// //Mongoos setup

// const PORT = process.env.PORT || 6001;
// mongoose.set('strictQuery', false);
// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

//     /* ADD DATA ONE TIME */
//     // User.insertMany(users);
//     // Post.insertMany(posts);
//   })
//   .catch((error) => console.log(`${error} did not connect`));


import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js"
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import chatRoutes from "./routes/chat.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts} from './data/index.js';

dotenv.config();

/* configurations */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 6001;

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname, "public/assets")));

// File storage
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets");
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

//routes with files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chat", chatRoutes);

//Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // Handle chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast message to all clients
    });
});

//Mongoos setup
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));