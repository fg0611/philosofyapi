const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const {
  getPrinters,
  printFile,
  printDirect,
} = require("@thiagoelg/node-printer");
// import fetch from "node-fetch";
// import express from "express";
// import cors from "cors";
// import { getPrinters, printFile, printDirect } from "@thiagoelg/node-printer";
// import { findPrinters, getAndPrint, getByName, getBySchool } from "./print.js";
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

const port = 8000;

app.get("/", async (req, res) => {
  return res.status(200).send("api working");
});

app.get("/printers", async (req, res) => {
  return res.status(200).json(findPrinters());
});

app.get("/print/:printer", async (req, res) => {
  const { printer } = req.params;
  console.log(printer);
  const result = await getAndPrint(printer);
  if (result) {
    return res.status(200).json({ message: "print job completed!" });
  }
  return res.status(403).json({ message: "bad request" });
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

const findPrinters = () => {
  try {
    return getPrinters();
  } catch (e) {
    console.log(e);
  }
};

const printData = async (data, printer) => {
  if (!printer || !printer?.length) return false;
  printer = printer || "POS-80C";
  if (process.platform != "win32") {
    console.log("NOT win32");
    printFile({
      data: "some",
      printer,
      success: function (jobID) {
        console.log("sent to printer with ID: " + jobID);
      },
      error: function (err) {
        console.log(err);
      },
    });
    return true;
  } else {
    // not yet implemented, use printDirect and text
    console.log("is win32");
    printDirect({
      data,
      type: "TEXT",
      // printer: printer.getPrinters()[1].name,
      printer: printer,
      success: function (jobID) {
        console.log("sent to printer with ID: " + jobID);
      },
      error: function (err) {
        console.log(err);
      },
    });
    return true;
  }
};

const getAndPrint = async (printer) => {
  try {
    if (!printer || !printer?.length) return false;
    const school = schools[Math.floor(Math.random() * schools.length)];
    const response = await fetch(
      "https://philosophy-quotes-api.glitch.me/quotes/philosophy/" + school
    );
    const jsonData = await response.json();
    // console.log(jsonData);
    const foundQuote = jsonData[Math.floor(Math.random() * jsonData.length)];
    // console.log(jsonData);
    const quote = `${JSON.stringify(foundQuote["quote"])} \n ${JSON.stringify(
      foundQuote["source"]
    )}`;
    const result = await printData(quote, printer);
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
};

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
