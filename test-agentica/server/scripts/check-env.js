console.log('Starting environment check...');

require('dotenv').config();

console.log('After dotenv.config():');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');
console.log('GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? 'Set' : 'Not set');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
    console.log('✅ All required Gmail environment variables are set');
    console.log('Ready to test Gmail functionality');
} else {
    console.log('❌ Missing required Gmail environment variables');
    console.log('Please check your .env file');
}
