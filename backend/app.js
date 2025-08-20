const express = require('express');
const morgan = require('morgan');
const connectToDatabase = require('./dbconnect');
const userRoutes = require('./routes/user.routes');
const notesRoutes = require('./routes/notes.route');
const { PORT, FRONTEND_URL } = require('./config/dotenvx');
const cookieParser = require('cookie-parser');
const cors = require('cors');


// 3rd party middleware
const app = express();
connectToDatabase();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:5173"],
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));


// REST API routes
app.use('/api/user', userRoutes);
app.use('/api/note', notesRoutes);


// Api health check its live or not
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Ash Notes App backend APIs Server!",
        frontend: FRONTEND_URL,
    });
});

// Listen App 
app.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT}`);
});