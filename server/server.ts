import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhook } from "./controller/Webhooks.js";

const app = express();
const port = process.env.PORT || 3000;
let databaseConnection: Promise<void> | undefined;

const ensureDatabaseConnection = () => {
  if (!databaseConnection) {
    databaseConnection = connectDB()
      .then(() => console.log('MongoDB connected successfully.'))
      .catch((error) => {
        databaseConnection = undefined;
        throw error;
      });
  }

  return databaseConnection;
};

app.use(async (_req, _res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    next(error);
  }
});

app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (_req: Request, res: Response) => {
  res.send('Server is Live!');
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, database: 'connected' });
});

const startServer = async () => {
  try {
    await ensureDatabaseConnection();
  } catch (error) {
    console.error('MongoDB connection failed. Server cannot start without a database connection:', error);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;