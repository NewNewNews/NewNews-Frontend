// import { getServerSession } from "next-auth";

// import { authOptions } from "../api/auth/[...nextauth]";
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// export async function getSession() {
//     return await getServerSession(authOptions);
// }

// export default async function getCurrentUser() {
//     try {
//         const session = await getSession();

//         if (!session?.user?.email) {
//             return null;
//         }

//         const currentUser = await prisma.user.findUnique({
//             where: {
//                 email: session.user.email
//             }
//         });

//         if (!currentUser) {
//             return null;
//         }

//         return currentUser;
//     } catch (error) {
//         return  null;
//     }
// }