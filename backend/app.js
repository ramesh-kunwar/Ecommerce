import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // when we want to use form data
app.use(cors())
app.use(cookieParser());

// morgan logger
app.use(morgan('tiny'))

export default app;
