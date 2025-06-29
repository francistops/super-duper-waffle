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
app.use('/users', userRoute);

import appointmentRoute from './routers/appointmentRoutes.js';
app.use('/appointments', appointmentRoute);

import serviceRoute from './routers/serviceRoutes.js';
app.use('/services', serviceRoute);

import feedbackRoute from './routers/feedbackRoutes.js';
app.use('/feedback', feedbackRoute);

import debugRoute from './routers/debugRoutes.js';
app.use('/debug', debugRoute);


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});