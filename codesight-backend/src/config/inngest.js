import { Inngest } from "inngest";
import connectDB from "./db.js";
import User from './../models/User.js';
import { deleteStreamUser, upsertStreamUser } from "./streams.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "codesight" });

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async({event}) => {
        await connectDB();
        const {id, image_url, first_name, last_name, email_addresses} = event.data;
        
        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name:`${first_name || " "} ${last_name || " "}`,
            profileImage: image_url,
        }

        const userCreated = await User.create(newUser)

        await upsertStreamUser({
            id: newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profileImage
        })

        // challenge for me: send a welcome email here later.
    }
)

const deleteUser = inngest.createFunction(
    { id: "delete-user" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await connectDB();
        const { id } = event.data;

        const deletedUser = await User.findOneAndDelete({clerkId:id})
        await deleteStreamUser(id.toString());
    }
)

export const functions = [syncUser, deleteUser]