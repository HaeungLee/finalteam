// 직접 Gmail Wrapper 함수 테스트
const { GmailService } = require('@wrtnlabs/connector-gmail');
require('dotenv').config();

console.log('🔧 Gmail Wrapper 직접 테스트');

// 실제 서버에서 사용하는 것과 동일한 래퍼 생성
const gmailService = new GmailService({
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN
});

const wrappedGmailService = {
    ...gmailService,
    sendEmail: async (input) => {
        console.log('🔧 Gmail Wrapper - Original input:', JSON.stringify(input, null, 2));
        
        // Convert parameters to correct format - handle all possible variations
        const convertedInput = {
            to: input.to ? (Array.isArray(input.to) ? input.to : [input.to]) 
                : input.receiver ? (Array.isArray(input.receiver) ? input.receiver : [input.receiver])
                : input.email ? (Array.isArray(input.email) ? input.email : [input.email])
                : [],
            subject: input.subject || input.title || '',
            body: input.body || input.content || input.message || input.text || '',
            cc: input.cc ? (Array.isArray(input.cc) ? input.cc : [input.cc]) : undefined,
            Bcc: input.bcc || input.Bcc ? (Array.isArray(input.bcc || input.Bcc) ? (input.bcc || input.Bcc) : [input.bcc || input.Bcc]) : undefined,
        };
        
        console.log('🔄 Gmail Wrapper - Converted input:', JSON.stringify(convertedInput, null, 2));
        
        try {
            const result = await gmailService.sendEmail(convertedInput);
            console.log('✅ Gmail Wrapper - Send success:', result);
            return result;
        } catch (error) {
            console.error('❌ Gmail Wrapper - Send failed:', error);
            throw error;
        }
    }
};

// 테스트 1: LLM이 보내는 방식 (receiver + content)
console.log('\n=== 테스트 1: LLM 방식 (receiver + content) ===');
wrappedGmailService.sendEmail({
    receiver: "smanew28@gmail.com",
    subject: "Wrapper 테스트", 
    content: "Gmail Wrapper가 정상 작동하는지 확인하는 테스트입니다."
}).then(result => {
    console.log('테스트 1 성공:', result);
}).catch(error => {
    console.error('테스트 1 실패:', error.message);
});

// 테스트 2: 정상 방식 (to + body)
console.log('\n=== 테스트 2: 정상 방식 (to + body) ===');
wrappedGmailService.sendEmail({
    to: "smanew28@gmail.com",
    subject: "정상 테스트",
    body: "정상적인 파라미터로 보내는 테스트입니다."
}).then(result => {
    console.log('테스트 2 성공:', result);
}).catch(error => {
    console.error('테스트 2 실패:', error.message);
});
