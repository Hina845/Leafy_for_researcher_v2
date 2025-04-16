import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRouter from './routes/userRoutes.js';

const app = new express();

const allowedOrigin = 'https://localhost:7777';

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
      if (origin === allowedOrigin || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use('/public', express.static('public'));

app.set('view engine', 'ejs');

app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
})

export default app;