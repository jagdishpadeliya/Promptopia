import NextAuth from "next-auth";
import GithubProvider from 'next-auth/providers/github'
import { connectToDB } from "@utils/database";
import User from "@models/user";
const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user.email
            })
            session.user.id = sessionUser._id.toString();
            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDB();
                const userExists = await User.findOne({
                    email: profile.email
                })
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.avatar_url
                    })
                }
                return true;
            } catch (error) {
                console.log(error);
                return false
            }
        }
    }

})

export { handler as GET, handler as POST }