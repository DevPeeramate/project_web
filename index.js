import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import memberRoute from './routes/memberRoute.js';
import roomRoute from './routes/roomRoute.js';
import reservationRoute from './routes/reservationRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use("/img_mem", express.static("img_mem"));
app.use("/img_room", express.static("img_room"));

const theSecret = process.env.SECRET;
app.use(session({
    secret: theSecret,
    resave: false,
    saveUninitialized: true,
}))

app.use(cors({
    origin:["http://localhost:8080","http://127.0.0.1:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(memberRoute);
app.use(roomRoute);
app.use(reservationRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})