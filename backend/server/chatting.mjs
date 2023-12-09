import express, { request } from "express";
import pg from "pg";
import dotenv from "dotenv";
import { stat } from "fs";
import { count } from "console";

const chattingRouter = express.Router();
dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

chattingRouter.get("/", (req, res) => {
  res.json("success채팅");
});

chattingRouter.get("/create-table", async (req, res) => {
  try {
    const client = await pool.connect();

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS roomList2 (
        roomId VARCHAR(255),
        roomName VARCHAR(255),
        userId VARCHAR(255),
        helperId VARCHAR(255),
        sub VARCHAR(255),
        lastChat VARCHAR(255)
      );
    `;

    await client.query(createTableQuery);

    client.release();
    
    res.json("Table created successfully!");
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json("Internal Server Error");
  }
});

chattingRouter.get("/insert-data", async (req, res) => {
  try {
    const client = await pool.connect();
    var now = new Date();
    var roomId = 
    ("00" + now.getFullYear()).slice(-2) +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    ("0" + now.getDate()).slice(-2) +
    ("0" + now.getHours()).slice(-2) +
    ("0" + now.getMinutes()).slice(-2) +
    ("0" + now.getSeconds()).slice(-2);

    console.log(roomId);

    const insertDataQuery = (`
      INSERT INTO roomList2 (roomId, roomName, userId, helperId, sub ,lastChat) VALUES
      ($1, '김동국_이숙희', 'dongguk123', 'sook_hee', '아이 3시간 봐주실 분 구합니다.', '알겠습니다~')`);

    await client.query(insertDataQuery, [roomId]);


    client.release();
    
    res.json("Data inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json("Internal Server Error");
  }
});

chattingRouter.get("/get-all-roomList", async (req, res) => {
  try {
    const client = await pool.connect();
    // Define your select query to retrieve all data
    const getAllDataQuery = `
      SELECT * FROM roomList2;
    `;
    // Execute the query
    const result = await client.query(getAllDataQuery);
    // Release the client back to the pool
    client.release();

    // Send the retrieved data as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json("Internal Server Error");
  }
});

chattingRouter.get("/delete-all-data", async (req, res) => {
  try {
    const client = await pool.connect();
    // Define your delete query to remove all data
    const deleteAllDataQuery = `
      DELETE FROM roomList2;
    `;
    // Execute the query
    await client.query(deleteAllDataQuery);
    // Release the client back to the pool
    client.release();

    res.json("All data deleted successfully!");
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json("Internal Server Error");
  }
});

export default chattingRouter;