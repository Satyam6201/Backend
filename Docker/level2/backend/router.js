import express from "express";
import { login, logout, register } from "./controller/user.controller.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/logout", logout);

export default router;