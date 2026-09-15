import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhook } from "./controller/Webhooks.js";

const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed. Server cannot start without a database connection:', error);
    process.exit(1);
  }
 
  app.post('/api/clerk', express.raw({type: "application/json"}), clerkWebhook)

  app.use(cors());
  app.use(express.json());
  app.use(clerkMiddleware());

  app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
  });

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ success: true, database: 'connected' });
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

startServer();