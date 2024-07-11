"use server";

import mysql from "mysql2/promise";
import { unstable_noStore as noStore } from "next/cache";

async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
    });
    return connection;
  } catch (error) {
    console.log("Error connecting to the DB");
    console.error(error);
  }
}

export async function getAdminDataSQL() {
  //noStore() Next.js API used to opt out of static rendering (making the components dynamic)
  noStore();

  //connect to the DB
  const connection = await createConnection();

  try {
    //uses the JSON_ARRAYAGG to group the joined results in an array (as apposed to returning a new row for each image)
    const sql = `
      SELECT l.listingID, l.model, l.price, l.colour, l.year, l.mileage, l.description, l.available, l.createdAt, JSON_ARRAYAGG(images.imageID) AS images FROM listings as l
      INNER JOIN images
      ON l.listingID=images.listingID
      GROUP BY l.listingID;
      `;
    //run the query
    const [rows, fields] = await connection.query(sql);

    //return the data to the client
    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    await connection.end();
  }
}

export async function getShowroomDataSQL() {
  noStore();

  //connect to the DB
  const connection = await createConnection();

  try {
    //uses the JSON_ARRAYAGG to group the joined results in an array (as apposed to returning a new row for each image)
    const sql = `
      SELECT l.listingID, l.model, l.price, l.colour, l.year, l.mileage, l.description, l.available, l.createdAt, JSON_ARRAYAGG(images.imageID) AS images FROM listings as l
      INNER JOIN images
      ON l.listingID=images.listingID
      GROUP BY l.listingID;
      `;

    const [rows, fields] = await connection.query(sql);

    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    await connection.end();
  }
}

export async function getListingByIdSQL(id) {
  noStore();

  //connect to the DB
  const connection = await createConnection();

  try {
    //write the quert to join the listing table entry with its corresponding entries in the images table
    //uses the JSON_ARRAYAGG to group the joined results in an array (as apposed to returning a new row for each image)
    const sql = `
      SELECT l.listingID, l.model, l.price, l.colour, l.year, l.mileage, l.description, l.available, l.createdAt, JSON_ARRAYAGG(images.imageID) AS images FROM listings as l
      INNER JOIN images
      ON l.listingID=images.listingID AND l.listingID = '${id}'
      GROUP BY l.listingID;
      `;

    const [rows, fields] = await connection.query(sql);

    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    await connection.end();
  }
}

export async function getUserSQL(username) {
  noStore();
  const connection = await createConnection();
  try {
    const sql = `SELECT * FROM users WHERE username = '${username}';`;
    const [res, fields] = await connection.query(sql);
    return res[0];
  } catch (error) {
  } finally {
    await connection.end();
  }
}
