import nextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDB } from "@utils/database";

console.log({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});
const handler = nextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ profile }) {
      let username = profile.name
        .replace(/[^a-zA-Z0-9._]/g, "") // Remove invalid characters
        .toLowerCase();

      // Ensure the username length is between 8-20 characters
      if (username.length < 8) {
        username = username.padEnd(8, "x"); // Pad with 'x' if too short
      } else if (username.length > 20) {
        username = username.substring(0, 20); // Truncate if too long
      }
      try {
        await connectToDB();
        //chk if user already exists
        const userExists = await User.findOne({
          email: profile.email,
        });
        //if not,create new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: username,
            // username: profile.name.replace(" ","").toLowerCase(),
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async signOut({ profile }) {},
  },
});

export { handler as GET, handler as POST };
