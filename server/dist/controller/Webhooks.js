import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/User.js";
export const clerkWebhook = async (req, res) => {
    try {
        const evt = await verifyWebhook(req);
        if (evt.type === 'user.created' || evt.type === 'user.updated') {
            const email = evt.data.email_addresses?.[0]?.email_address;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Clerk user has no email address',
                });
            }
            const name = [evt.data.first_name, evt.data.last_name]
                .filter(Boolean)
                .join(' ');
            const user = await User.findOneAndUpdate({ clerkId: evt.data.id }, {
                $set: {
                    clerkId: evt.data.id,
                    email,
                    name: name || email,
                    image: evt.data.image_url,
                },
                $setOnInsert: { role: 'user' },
            }, {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true,
            });
            console.log(`Synced Clerk user ${user.clerkId} to MongoDB as ${user._id}`);
        }
        return res.json({ success: true, message: 'Webhook received' });
    }
    catch (err) {
        console.error('Error verifying webhook:', err);
        return res.status(400).json({
            success: false,
            message: 'Error verifying webhook',
        });
    }
};
