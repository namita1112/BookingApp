import express from "express";
import { deleteUser, getUser, getUsers, updatedUser } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication", verifyToken, (req, res, next) => {
    res.send("You are logged in.!")
})

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
    res.send("You are logged in and you can delete your account.!")
})

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
    res.send("Hello Admin, You are logged in and you can delete all account.!")
})
//CREATE
// router.post("/", createHotel);
//UPDATE
router.put("/:id", verifyUser, updatedUser);
//DELETE
router.delete("/:id", verifyUser, deleteUser);
//GET
router.get("/:id", verifyUser, getUser);
//GET ALL
router.get("/", verifyAdmin, getUsers);

export default router