import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3200;

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

app.post("/send-email", (req, res) => {
  const { name, email, question } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "contact@lestech.org",
    subject: `Consulta de ${name} (${email})`,
    text: `Nombre: ${name}\nEmail: ${email}\nConsulta:\n${question}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo:", error);
      res.status(500).send("Error al enviar el correo");
    } else {
      console.log("Correo enviado: " + info.response);
      res.status(200).send("Correo enviado");
    }
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor en ejecución en http://0.0.0.0:${port}`);
});
