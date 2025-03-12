/**
 * This script helps prepare the project for Vercel deployment
 * 
 * It provides a checklist of things to verify before deploying to Vercel
 */

console.log('\n🚀 TypeMaster Vercel Deployment Checklist 🚀\n');

console.log('1. Ensure your environment variables are set up in Vercel:');
console.log('   - DATABASE_URL: Your PostgreSQL connection string');
console.log('   - NEXTAUTH_URL: Your production URL (e.g., https://your-app.vercel.app)');
console.log('   - NEXTAUTH_SECRET: A secure random string for NextAuth');
console.log('   - SOCKET_SERVER_URL: URL for your Socket.io server (if hosted separately)\n');

console.log('2. Verify your database is accessible from Vercel:');
console.log('   - If using a local database, consider migrating to a cloud provider');
console.log('   - Recommended: Neon, Supabase, or Railway for PostgreSQL\n');

console.log('3. Socket.io server deployment options:');
console.log('   - Option 1: Deploy as a separate service (Render, Railway, etc.)');
console.log('   - Option 2: Use Vercel Serverless Functions with WebSockets (requires Vercel Pro)\n');

console.log('4. Update the following files if needed:');
console.log('   - src/lib/socketClient.ts: Update the socket server URL for production');
console.log('   - next.config.js: Add any required configuration for Vercel\n');

console.log('5. Run the following commands before deploying:');
console.log('   - npm run build: Verify the build succeeds locally');
console.log('   - npm run lint: Fix any linting issues\n');

console.log('6. Deploy to Vercel:');
console.log('   - Connect your GitHub repository to Vercel');
console.log('   - Configure the build settings');
console.log('   - Deploy!\n');

console.log('Good luck with your deployment! 🎉'); 