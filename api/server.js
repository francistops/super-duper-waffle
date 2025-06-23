import express, { json } from "express";

const app = express();
const PORT = 3000;

import cors from "cors";
app.use(cors({
   origin: ['https://ft.ca', 'https://www.ft.ca']
}));

app.use(json());

import negotiate from './middlewares/negotiate.js';
app.use(negotiate);

import userRoute from './routers/userRoutes.js';
app.use('/user', /*validateToken,*/ userRoute);

import taskRoute from './routers/taskRoutes.js';
app.use('/task', taskRoute);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});