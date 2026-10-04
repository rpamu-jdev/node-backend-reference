import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Book = sequelize.define("Book", {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING },
  year: { type: DataTypes.INTEGER },
});
