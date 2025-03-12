import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Add export for dynamic route handling
export const dynamic = 'force-dynamic';

// Create the handler with the imported authOptions
const handler = NextAuth(authOptions);

// Export the handler functions
export { handler as GET, handler as POST }; 