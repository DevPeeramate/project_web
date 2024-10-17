import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors';
import bodyParser from 'body-parser';
import memberRoute from './routes/memberRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// app.use(cors());
app.use(memberRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})