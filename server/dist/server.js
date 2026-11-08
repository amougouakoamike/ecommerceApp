import "dotenv/config";
import express from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkClient, clerkMiddleware, getAuth } from '@clerk/express';
import { clerkWebhook } from "./controller/Webhooks.js";
import { syncUserProfile } from "./services/userSync.js";
const app = express();
const port = process.env.PORT || 3000;
let databaseConnection;
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
    }
    catch (error) {
        console.error('MongoDB connection failed:', error);
        next(error);
    }
});
app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhook);
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.post('/api/users/sync', async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses.find(({ id }) => id === clerkUser.primaryEmailAddressId)?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) {
            return res.status(422).json({
                success: false,
                message: 'The Clerk account has no email address to sync',
            });
        }
        const user = await syncUserProfile({
            clerkId: clerkUser.id,
            email,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl,
        });
        return res.json({ success: true, userId: user._id.toString() });
    }
    catch (error) {
        console.error(`Error syncing authenticated Clerk user ${userId} to MongoDB:`, error);
        return res.status(500).json({
            success: false,
            message: 'Could not save your account to the database',
        });
    }
});
app.get('/', (_req, res) => {
    res.send('Server is Live!');
});
app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        database: 'connected',
        webhookSigningSecretConfigured: Boolean(process.env.CLERK_WEBHOOK_SIGNING_SECRET),
    });
});
const startServer = async () => {
    try {
        await ensureDatabaseConnection();
    }
    catch (error) {
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
