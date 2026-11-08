import User from "../models/User.js";
export const syncUserProfile = async ({ clerkId, email, firstName, lastName, imageUrl, }) => {
    const name = [firstName, lastName].filter(Boolean).join(" ");
    const user = await User.findOneAndUpdate({ clerkId }, {
        $set: {
            clerkId,
            email,
            name: name || email,
            image: imageUrl ?? undefined,
        },
        $setOnInsert: { role: "user" },
    }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
    });
    if (!user) {
        throw new Error(`MongoDB did not return the synced Clerk user ${clerkId}`);
    }
    return user;
};
