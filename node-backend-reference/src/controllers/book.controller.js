import { Book } from "../models/book.model.js";

export const getAllBooks = async (req, res) => {
  try {
    const { author } = req.query;
    const condition = author ? { where: { author } } : {};
    const books = await Book.findAll(condition);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books", details: err.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch book", details: err.message });
  }
};

export const createBook = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete book", details: err.message });
  }
};
