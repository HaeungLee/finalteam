const { GmailService } = require('@wrtnlabs/connector-gmail');
require('dotenv').config();

async function testGmailWithCorrectParams() {
    console.log('=== Gmail Connector Test with Correct Parameters ===');
    
    try {
        // Environment check
        console.log('Checking environment variables...');
        const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'];
        for (const varName of requiredVars) {
            if (!process.env[varName]) {
                throw new Error(`Missing required environment variable: ${varName}`);
            }
            console.log(`✓ ${varName}: ${process.env[varName].substring(0, 20)}...`);
        }

        // Create Gmail service instance
        console.log('\nCreating Gmail service instance...');
        const gmailService = new GmailService({
            googleClientId: process.env.GOOGLE_CLIENT_ID,
            googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
            googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN
        });
        console.log('✓ Gmail service instance created successfully');

        // Test email with correct parameters (to as array)
        console.log('\nTesting sendEmail with correct parameters...');
        const emailInput = {
            to: ['smanew28@gmail.com'], // Array format (correct!)
            subject: '테스트 - 올바른 파라미터',
            body: '<h1>테스트 이메일</h1><p>이것은 올바른 파라미터 형식으로 보내는 테스트 이메일입니다.</p><p>현재 시간: ' + new Date().toLocaleString() + '</p>'
        };
        
        console.log('Email parameters:', JSON.stringify(emailInput, null, 2));
        
        console.log('\nSending email...');
        const result = await gmailService.sendEmail(emailInput);
        
        console.log('✅ Email sent successfully!');
        console.log('Send result:', result);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
    }
}

testGmailWithCorrectParams();
