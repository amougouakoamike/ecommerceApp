import User from "../models/User.js";

type ClerkUserProfile = {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
};

export const syncUserProfile = async ({
  clerkId,
  email,
  firstName,
  lastName,
  imageUrl,
}: ClerkUserProfile) => {
  const name = [firstName, lastName].filter(Boolean).join(" ");

  const user = await User.findOneAndUpdate(
    { clerkId },
    {
      $set: {
        clerkId,
        email,
        name: name || email,
        image: imageUrl ?? undefined,
      },
      $setOnInsert: { role: "user" },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new Error(`MongoDB did not return the synced Clerk user ${clerkId}`);
  }

  return user;
};
