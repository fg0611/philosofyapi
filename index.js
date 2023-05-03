const port = process.env.PORT || 8000;
const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOp = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOp));


app.get("/", async (req, res) => {
  return res.status(200).send("api working");
});

app.get("/school", async (req, res) => {
  const result = await getBySchool();
  if (result?.length) {
    return res.status(200).send(result);
  }
  return res.status(403).json({ message: "bad request" });
});
app.get("/name", async (req, res) => {
  const result = await getByName();
  if (result?.length) {
    return res.status(200).send(result);
  }
  return res.status(403).json({ message: "bad request" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const names = [
  "Marcus Aurelius",
  "Seneca",
  "Epictetus",
  "Alan Watts",
  "Rumi",
  "Carl G. Jung",
  "Friedrich Nietzsche",
  "Jean-Paul Sartre",
  "Fyodor Dostoyevsky",
  "Plato",
  "Aristotle",
  "Henry David Thoreau",
  "Ralph Waldo Emerson",
  "Christopher McCandless",
  "René Descartes",
  "Baruch Spinoz",
  "Leibniz",
  "John Locke",
  "George Berkeley",
  "David Hume",
];

const schools = [
  "Stoicism",
  "Mysticism",
  "Existentialism",
  "Classical Greek",
  "Transcendentalism",
  "Rationalism",
  "Empiricism",
];

const getByName = async () => {
  try {
    const name = names[Math.floor(Math.random() * names.length)];
    const response = await fetch(
      "https://philosophy-quotes-api.glitch.me/quotes/author/" + name
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
      "https://philosophy-quotes-api.glitch.me/quotes/philosophy/" + school
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
