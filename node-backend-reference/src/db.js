import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME || "extio_learn_db",
  process.env.DB_USER || "az_postgress_user",
  process.env.DB_PASS || "NwQsR@404#123",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  }
);
