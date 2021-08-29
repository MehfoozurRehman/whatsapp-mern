import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
// import multer from "multer";
import cors from "cors";
import ChatModal from "./Modal/chatModal.js";
import RoomModal from "./Modal/roomModal.js";
import UserModal from "./Modal/userModal.js";
// import imageToBase64 from "image-to-base64";

// app config

const app = express();
const port = process.env.PORT || 9000;

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./Upload");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({
//   storage: storage,
//   // limits: { fileSize: 10 * 1024 * 1024 },
// });

// const pusher = new Pusher({
//   appId: "1253725",
//   key: "d1208821573922ba3148",
//   secret: "e3aeafdcb7cc6ed4166d",
//   cluster: "ap1",
//   useTLS: true,
// });

// middleware

app.use(express.json());
app.use(cors());
// pusher.trigger("v1", "insert", {
//   message: "hello world",
// });
// db config
const connection_url =
  "mongodb+srv://admin:3NU0l9zjSIH2FmJz@cluster0.cgmqu.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
// api endpoints

app.get("/", (req, res) => {
  res.send("hello welcome to todo api");
});

// user endpoints
app.post("/v1/createUser", (req, res) => {
  let todoEntry = req.body;

  UserModal.create(todoEntry, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/v1/findAllUsers", (req, res) => {
  UserModal.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
app.get("/v1/checkIfUsersExist", (req, res) => {
  const userEmail = req.body.email;
  UserModal.exists({ email: userEmail }).then((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/v1/deleteUser", (req, res) => {
  let todo_id = req.body.id;
  UserModal.findByIdAndRemove({ _id: todo_id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/v1/deleteAllUers", (req, res) => {
  UserModal.remove((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// room endpoints

app.post("/v1/createRoom", (req, res) => {
  RoomModal.create(req.body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/v1/findAllRooms", (req, res) => {
  RoomModal.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/v1/deleteRoom", (req, res) => {
  let todo_id = req.body.id;
  RoomModal.findByIdAndRemove({ _id: todo_id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/v1/deleteAllRooms", (req, res) => {
  RoomModal.remove((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// chat endpoints
app.post("/v1/createMessage", (req, res) => {
  let todoEntry = req.body;

  ChatModal.create(todoEntry, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/v1/findAllMessages", (req, res) => {
  ChatModal.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/v1/deleteMessage", (req, res) => {
  let todo_id = req.body.id;
  ChatModal.findByIdAndRemove({ _id: todo_id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/v1/deleteAllMessages", (req, res) => {
  ChatModal.remove((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// listners

app.listen(port, () => {
  console.log("api running");
});
