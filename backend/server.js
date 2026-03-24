import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './src/routes/crud.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

function serverListenLog() {
    console.log("Server running at http://localhost:" + PORT);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, serverListenLog);