import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import express from 'express';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { port } from './src/config/appConfig.js';
import authRoutes from './src/routes/authRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import moduleRoutes from './src/routes/moduleRoutes.js';
import certificateRoutes from './src/routes/certificateRoutes.js';
import quizRoutes from './src/routes/quizRoutes.js';
import chatbotRoutes from './src/routes/chatbotRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.removeAllListeners('warning');
process.noDeprecation = true;

const app = express();

// --- Middleware ---
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log(process.env.FRONTEND_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/user', userRoutes);
app.use('/review', reviewRoutes);
app.use('/course', moduleRoutes);
app.use('/course', quizRoutes);
app.use('/course', certificateRoutes);
app.use('/chatbot', chatbotRoutes); 
app.use('/admin', adminRoutes);

// --- Serving Static Files ---
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads/'))); 

// Basic route untuk Testing
app.get('/', (req, res) => {
    res.send('Backend RuangIlmu API is running');
});

// --- Start Server ---
const appStart = async () => {
    try {
        app.listen(port, () => {
            console.log(`✅ Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
};

appStart();
