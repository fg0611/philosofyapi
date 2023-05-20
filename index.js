import express, { urlencoded, json } from "express";
import fetch from "node-fetch";
import cors from "cors";
import { schools, names } from "./lists.js";
import { getText } from "./chat.js";
const port = process.env.PORT || 8000;

// EXPRESS APP
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const whitelist = [
  "https://philosofy.vercel.app",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
];

const corsOp = {
  origin: function (origin, callback) {
    // allow requests with no origin
    // console.log("origin => ",origin);
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      console.log(origin);
      var message =
        "The CORS policy for this origin doesn't " +
        "allow access from the particular origin.";
      return callback(new Error(message), false);
    } else {
      console.log("There is a problem with CORS");
      return callback(null, true);
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOp));

app.get("/", async (req, res) => {
  return res.status(200).send("api working");
});

app.post("/chat", async (req, res) => {
  try {
    const reponse = await getText(req.body.prompt);
    if (reponse) {
      console.log(reponse);
      return res.status(200).json({message: reponse});
    }
    return res.status(400).json({ message: "error" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.get("/school", async (req, res) => {
  const result = await getBySchool();
  if (result?.length) {
    return res.status(200).json({ message: result });
  }
  return res.status(403).json({ message: "bad request" });
});
app.get("/name", async (req, res) => {
  const result = await getByName();
  if (result?.length) {
    return res.status(200).json({ message: result });
  }
  return res.status(403).json({ message: "bad request" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const getByName = async () => {
  try {
    const name = names[Math.floor(Math.random() * names.length)];
    const response = await fetch(
      process.env.API_URL + "/quotes/author/" + name
    );
    const jsonData = await response.json();

    const quote = jsonData[Math.floor(Math.random() * jsonData.length)];
    // console.log(jsonData);
    const result = `${JSON.stringify(quote["quote"])} \n ${JSON.stringify(
      quote["source"]
    )}`;
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const getBySchool = async () => {
  try {
    const school = schools[Math.floor(Math.random() * schools.length)];
    const response = await fetch(
      process.env.API_URL + "/quotes/philosophy/" + school
    );
    const jsonData = await response.json();
    const quote = jsonData[Math.floor(Math.random() * jsonData.length)];
    // console.log(jsonData);
    const result = `${JSON.stringify(quote["quote"])} \n ${JSON.stringify(
      quote["source"]
    )}`;
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
};
