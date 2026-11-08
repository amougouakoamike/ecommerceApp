import { verifyWebhook } from "@clerk/express/webhooks"
import { Request, Response } from "express"
import User from "../models/User.js"



export const clerkWebhook = async (req: Request, res:Response) => {
  let evt

  try {
    evt = await verifyWebhook(req)
  } catch (err) {
    console.error('Clerk webhook signature verification failed:', err)
    return res.status(400).json({
      success: false,
      message: 'Webhook signature verification failed',
    })
  }

  console.log(`Received Clerk webhook: ${evt.type}`)

  try {
    if (evt.type === 'user.deleted') {
      const result = await User.deleteOne({ clerkId: evt.data.id })
      console.log(`Deleted Clerk user ${evt.data.id} from MongoDB (${result.deletedCount} document)`)
      return res.json({ success: true, message: 'Webhook received' })
    }

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const email = evt.data.email_addresses?.find(
        ({ id }) => id === evt.data.primary_email_address_id,
      )?.email_address ?? evt.data.email_addresses?.[0]?.email_address

      if (!email) {
        console.error(`Clerk user ${evt.data.id} has no email address in the webhook payload`)
        return res.status(400).json({
          success: false,
          message: 'Clerk user has no email address',
        })
      }

      const name = [evt.data.first_name, evt.data.last_name]
        .filter(Boolean)
        .join(' ')

      const user = await User.findOneAndUpdate(
        { clerkId: evt.data.id },
        {
          $set: {
            clerkId: evt.data.id,
            email,
            name: name || email,
            image: evt.data.image_url,
          },
          $setOnInsert: { role: 'user' },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      )

      console.log(`Synced Clerk user ${user.clerkId} to MongoDB as ${user._id}`)
    }

    return res.json({ success: true, message: 'Webhook received' })
 
  } catch (err) {
    console.error(`Error syncing Clerk ${evt.type} event to MongoDB:`, err)
    return res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    })
  }
}