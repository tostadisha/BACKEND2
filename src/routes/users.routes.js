import { Router } from "express";
import userModel from "../models/user.model.js";
import { createHash } from "../utils/hashingUtils.js";
import passport from "passport";
import { generateToken } from "../utils/generateToken.js";
import { passportCall } from "../utils/passportCall.js";

const router = Router();

router.post("/register", passportCall("register"), async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).send("El registro ha fallado");

  const token = generateToken(user);
  res
    .cookie("coderPracticaIntegradora", token, { httpOnly: true })
    .send({ message: "Usuario registrado", user: user });
});
router.get("/profile", passportCall("jwt"), (req, res) => {
  const payload = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
  };
  res.status(200).send({ payload: payload });
});
router.post("/login", passportCall("login"), async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).send("El login ha fallado");

  const token = generateToken(user);
  res
    .cookie("coderPracticaIntegradora", token, { httpOnly: true })
    .send({ message: "Usuario logeado", user: user });
});
router.get("/logout", (req, res) => {
  res
    .clearCookie("coderPracticaIntegradora")
    .json({ message: "Se ha podido deslogear exitosamente" });
});
router.get("/github", passportCall("github"));
router.get("/githubcallback", passportCall("github"), (req, res) => {
  try {
    const user = req.user;
    if (!user)
      return res.status(401).json({ message: "Credenciales inválidas" });
    const token = generateToken(user);
    res
      .cookie("coderPracticaIntegradora", token, { httpOnly: true })
      .send("Se ha podido logear correctamente");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});
router.get("/current", passportCall("current"), (req, res) => {
  try {
    res.status(200).json({
      message: "Usuario autenticado",
      user: req.user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
export default router;
