import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", verifyToken, getAllBooks);
router.get("/:id", verifyToken, getBookById);
router.post("/", verifyToken, createBook);
router.delete("/:id", verifyToken, deleteBook);

export default router;
