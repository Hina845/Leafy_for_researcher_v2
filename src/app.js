import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRouter from './routes/userRoutes.js';

const app = new express();

const server = 'http://localhost:7777';

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: `${server}/*`,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use('/public', express.static('public'));

app.set('view engine', 'ejs');

app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.redirect(`${server}/public/`);
})

export default app;