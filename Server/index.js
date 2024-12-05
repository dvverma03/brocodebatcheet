const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const router = require('./src/router');

const bodyParser = require('body-parser');
const compiler = require('compilex');
const connectDB = require('./utils/db');

const options = { stats: true }; // Prints stats on console
compiler.init(options);

app.use(bodyParser.json());
app.use(cors());
app.use("/Client", express.static("D:/FullStack Projects/Code_Collaborator/Client"));

// Connect to Database
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect the database: " + err);
  });

// Socket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow cross-origin requests; customize for production
  },
});

const PORT = process.env.PORT || 5000;

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId],
    };
  });
};

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);

    // Notify all users that a new user has joined
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined-room", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-change", { code });
  });

  socket.on("sync-code", ({ socketId, code }) => {
    io.to(socketId).emit("code-change", { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

// API Routes
app.use("/api/v1/users", router);

app.get("/", (req, res) => {
  compiler.flush(() => {
    console.log("Deleted compiled files");
  });
  res.sendFile("D:/FullStack Projects/Code_Collaborator/Client/src/component/Editor.js");
});

// Code Compilation Route
app.post("/compile", (req, res) => {
  const { code, input, lang } = req.body;

  try {
    if (lang === "Cpp" || lang === "C") {
      const envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

      if (!input) {
        compiler.compileCPP(envData, code, (data) => {
          res.send(data.output ? data : { output: "Error" });
        });
      } else {
        compiler.compileCPPWithInput(envData, code, input, (data) => {
          res.send(data.output ? data : { output: "Error" });
        });
      }
    } else if (lang === "Java") {
      const envData = { OS: "windows" };

      if (!input) {
        compiler.compileJava(envData, code, (data) => {
          res.send(data.output ? data : { output: "Error" });
        });
      } else {
        compiler.compileJavaWithInput(envData, code, input, (data) => {
          res.send(data.output ? data : { output: "Error" });
        });
      }
    } else if (lang === "Python") {
      const envData = { OS: "windows" };

      if (!input) {
        compiler.compilePython(envData, code, (data) => {
          res.send(data.output ? data : { output: "Error" });
        });
      } else {
        compiler.compilePythonWithInput(envData, code, input, (data) => {
          res.send(data.output ? data : { output: "Error" });
        });
      }
    } else {
      res.status(400).send({ output: "Unsupported language" });
    }
  } catch (error) {
    console.error("Compilation Error:", error);
    res.status(500).send({ output: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});
