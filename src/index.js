import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB();

// require('dotenv').config({path: './env'})
// this code will also work but creates a bit of inconsistency as we are using import to import files

// import mongoose  from "mongoose";
// import { DB_NAME } from "./constants";
// import express from 'express'

// const app = express();
// function connectDB () {

// }

// connectDB()

/*
;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGOBD_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log('ERROR APPLICATION UNABLE TO TALK TO DB ', error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("ERROR: ",error);
    }
} ) ()

*/
