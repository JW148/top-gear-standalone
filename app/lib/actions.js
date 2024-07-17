"use server";

import { randomUUID } from "crypto";
import { unlink, writeFile } from "fs/promises";
import mysql from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { join } from "path";
import sharp from "sharp";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

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

export async function createListing(formData) {
  //double check the user is logged in
  const session = await getServerSession(authOptions);
  //if not, return early and don't complete the function
  if (session === null) return;

  //deconstruct the form data submitted by the client
  const { model, price, colour, year, description, available, mileage } =
    Object.fromEntries(formData.entries());
  //get the files that were uploaded by the client
  const fileArr = formData.getAll("files");

  //create a UUID id for the listing
  const id = randomUUID();

  //create a new listing entry on the DB
  await newListingEntry(
    id,
    model,
    price,
    colour,
    year,
    description,
    available,
    mileage
  );

  //compress + rename the uploaded images + create a new image entry in the DB
  fileArr.forEach(async (file) => {
    //compress and rename
    const result = await handleImage(file);
    //create new image entry
    await newImageListing(result.fileName, id);
  });
  revalidatePath("/admin");
  redirect("/admin");
}

//creates a new listing entry in the listings table
async function newListingEntry(
  id,
  model,
  price,
  colour,
  year,
  description,
  available,
  mileage
) {
  const connection = await createConnection();

  try {
    //first, create a new listing entry

    const sql = `
        INSERT INTO listings (listingID, model, price, colour, year, description, available, mileage, createdAt) VALUES ('${id}', '${model}', '${parseInt(
      price
    )}', '${colour}', '${year}', '${description}', '${
      available ? 1 : 0
    }', '${parseInt(mileage)}', '${new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")}')
      `;
    //complete the query
    await connection.query(sql);
  } catch (error) {
    console.log(error);
  } finally {
    await connection.end();
  }
}

async function newImageListing(imageID, listingID) {
  const connection = await createConnection();
  try {
    const sql = `
        INSERT INTO images (imageID, listingID) VALUES ('${imageID}', '${listingID}')
      `;
    await connection.query(sql);
  } catch (error) {
    console.log(error);
  } finally {
    await connection.end();
  }
}

async function handleImage(file) {
  try {
    //create a unique name for the file
    const fileName = Math.random().toString(16).slice(2) + ".jpg";
    //read file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    //compress file
    const compressedImg = await sharp(buffer)
      .jpeg({ quality: 30 })
      .withMetadata()
      .toBuffer();
    //write file
    const path = join(process.cwd() + "/public/images/" + fileName);
    await writeFile(path, compressedImg);
    return { fileName: fileName, path: path };
  } catch (error) {
    console.log("Error writing file!");
    console.error(error);
  }
}

export async function deleteListingSQL(id) {
  //double check the user is logged in
  const session = await getServerSession(authOptions);
  //if not, return early and don't complete the function
  if (session === null) return;

  const connection = await createConnection();
  try {
    //first delete all the images associated with the specified listing on the local disk
    const sql1 = `SELECT JSON_ARRAYAGG(images.imageID) AS images FROM images WHERE images.listingID = '${id}';`;
    const [rows, fields] = await connection.query(sql1);
    let images = rows[0].images;
    //delete all images on disk
    images.forEach(async (file) => {
      await unlink(join(process.cwd() + "/public/images/" + file));
    });

    //then delete the listing entry from the listings table
    //NOTE: we don't explicitly need to delete the associated images from the images table seperately because of the foreign key relation being set to cascade
    const sql2 = `DELETE FROM listings WHERE listings.listingID = '${id}';`;
    await connection.query(sql2);
    revalidatePath("/admin");
  } catch (error) {
    console.log(error);
  } finally {
    await connection.end();
  }
}

export async function editListingSQL(formData) {
  //double check the user is logged in
  const session = await getServerSession(authOptions);
  //if not, return early and don't complete the function
  if (session === null) return;

  //get the updated form data
  const {
    listingID,
    model,
    price,
    colour,
    year,
    description,
    available,
    mileage,
    files_to_keep,
    files_to_delete,
  } = Object.fromEntries(formData.entries());

  //////////////////// update the images table with in the new specified order ////////////////////
  const filesToKeep = files_to_keep.split(",");
  //append the listingID to the imageID so they can easily be entered into the images table
  const fileEntries = filesToKeep.map((file) => {
    return [file, listingID];
  });
  await updateImages(filesToKeep, fileEntries);

  ///////////////// write new files and create DB entries //////////////////////

  const newFiles = formData.getAll("files");

  //compress + rename the new images + create a new image entry in the DB
  //NOTE: file.size = 0 indicates no new files uploaded
  if (newFiles[0].size !== 0) {
    newFiles.forEach(async (file) => {
      //compress and rename
      const result = await handleImage(file);
      //create new image entry
      await newImageListing(result.fileName, listingID);
    });
  }

  /////////////// delete files from local disk and DB entries /////////////////

  //files_to_delete is returned as a single string so they need to be split and turned into an array
  //NOTE: if there are no files being deleted, the following will still produce an array of length 1, e.g. ['']
  const filesToDelete = files_to_delete.split(",");

  //NOTE: filesToDelete[0] = '' indicates there are no files to delete
  if (filesToDelete[0] !== "") {
    handleDelete(filesToDelete);
  }

  /////////////////// update the listing in the DB /////////////////////
  const connection = await createConnection();
  try {
    const sql = `
        UPDATE listings SET model = '${model}', price = '${parseInt(
      price
    )}', colour = '${colour}', year = '${year}', description = '${description}', available = '${
      available ? 1 : 0
    }', mileage = '${parseInt(
      mileage
    )}' WHERE listings.listingID = '${listingID}';
      `;
    await connection.query(sql);
  } catch (error) {
  } finally {
    await connection.end();
  }
  revalidatePath("/admin");
  redirect("/admin");
}

async function handleDelete(files) {
  const connection = await createConnection();
  try {
    //first delete the file entries in the db
    const sql = `DELETE FROM images WHERE images.imageID IN (?)`;
    const [result, fields] = await connection.query(sql, [files]);

    //then delete the files from the local disk
    files.forEach(async (file) => {
      await unlink(join(process.cwd() + "/public/images/" + file));
    });
  } catch (error) {
    console.log("Error deleting files!");
    console.error(error);
  } finally {
    connection.end();
  }
}

//rewrite the images in the images table in the new specified order
async function updateImages(files, fileEntries) {
  const connection = await createConnection();
  try {
    //first delete all the entries
    const sql = `DELETE FROM images WHERE images.imageID IN (?)`;
    await connection.query(sql, [files]);

    const sql2 = "INSERT INTO images (imageID, listingID) VALUES ?";
    await connection.query(sql2, [fileEntries]);
  } catch (error) {
    console.log(error);
  } finally {
    await connection.end();
  }
}

export async function contact(formData) {
  //double check the user is logged in
  const session = await getServerSession(authOptions);
  //if not, return early and don't complete the function
  if (session === null) return;
  const { name, confirmEmail, email, tel, message } = Object.fromEntries(
    formData.entries()
  );
  console.log(formData);
  //check if hidden field has been completed, if so it's likely to be a bot
  if (confirmEmail.length > 0) console.log("BOT!!!");
}
