import { GmailService } from "@wrtnlabs/connector-gmail";

/**
 * Gmail Wrapper Service
 * LLM이 보내는 파라미터를 Gmail Connector가 요구하는 형식으로 변환
 */
export class GmailWrapperService {
  private readonly gmailService: GmailService;

  constructor(props: {
    googleClientId: string;
    googleClientSecret: string;
    googleRefreshToken: string;
  }) {
    this.gmailService = new GmailService(props);
  }

  /**
   * LLM 친화적인 이메일 발송 함수 (유연한 파라미터 처리)
   * 
   * @param input - 이메일 발송 정보 (다양한 파라미터 이름 지원)
   */
  async sendEmail(input: {
    /**
     * 받는 사람 이메일 주소
     * @title 받는 사람 이메일
     */
    to?: string | string[];
    
    /**
     * 받는 사람 이메일 주소 (대체 이름)
     * @title 받는 사람 이메일
     */
    recipient?: string | string[];
    
    /**
     * 받는 사람 이메일 주소 (대체 이름)
     * @title 받는 사람 이메일
     */
    email?: string | string[];
    
    /**
     * 받는 사람 이메일 주소 (대체 이름)
     * @title 받는 사람 이메일
     */
    receiver?: string | string[];
    
    /**
     * 이메일 제목
     * @title 이메일 제목
     */
    subject?: string;
    
    /**
     * 이메일 제목 (대체 이름)
     * @title 이메일 제목
     */
    title?: string;
    
    /**
     * 이메일 내용
     * @title 이메일 내용
     */
    body?: string;
    
    /**
     * 이메일 내용 (대체 이름)
     * @title 이메일 내용
     */
    content?: string;
    
    /**
     * 이메일 내용 (대체 이름)
     * @title 이메일 내용
     */
    message?: string;
    
    /**
     * 이메일 내용 (대체 이름)
     * @title 이메일 내용
     */
    text?: string;
    
    /**
     * 참조 이메일 주소들 (선택사항)
     * @title 참조 이메일
     */
    cc?: string | string[];
    
    /**
     * 숨은참조 이메일 주소들 (선택사항)
     * @title 숨은참조 이메일
     */
    bcc?: string | string[];
  }) {
    console.log('🔧 GmailWrapperService.sendEmail 호출됨');
    console.log('📧 원본 입력 파라미터:', JSON.stringify(input, null, 2));
    
    try {
      // 다양한 파라미터 이름들을 표준화
      const to = input.to || input.recipient || input.email || input.receiver;
      const subject = input.subject || input.title;
      const body = input.body || input.content || input.message || input.text;
      const cc = input.cc;
      const bcc = input.bcc;
      
      if (!to) {
        throw new Error('받는 사람 이메일 주소가 필요합니다 (to, recipient, email, receiver 중 하나)');
      }
      if (!subject) {
        throw new Error('이메일 제목이 필요합니다 (subject, title 중 하나)');
      }
      if (!body) {
        throw new Error('이메일 내용이 필요합니다 (body, content, message, text 중 하나)');
      }
      
      const normalizedInput = {
        to,
        subject,
        body,
        cc,
        bcc
      };
      
      console.log('🔄 표준화된 파라미터:', JSON.stringify(normalizedInput, null, 2));
      
      // 파라미터를 Gmail Connector 형식으로 변환
      const gmailInput = {
        to: Array.isArray(normalizedInput.to) ? normalizedInput.to : [normalizedInput.to],
        subject: normalizedInput.subject,
        body: normalizedInput.body,
        cc: normalizedInput.cc ? (Array.isArray(normalizedInput.cc) ? normalizedInput.cc : [normalizedInput.cc]) : undefined,
        Bcc: normalizedInput.bcc ? (Array.isArray(normalizedInput.bcc) ? normalizedInput.bcc : [normalizedInput.bcc]) : undefined,
      };
      
      console.log('📤 Gmail Connector 호출 파라미터:', JSON.stringify(gmailInput, null, 2));
      
      // Gmail Connector 호출
      const result = await this.gmailService.sendEmail(gmailInput);
      
      console.log('✅ Gmail 발송 성공:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Gmail 발송 실패:', error);
      throw error;
    }
  }
  
  /**
   * 이메일 삭제
   */
  async deleteEmails(input: { ids: string[] }) {
    console.log('🗑️ 이메일 삭제 요청:', input);
    return await this.gmailService.deleteMailList(input);
  }
  
  /**
   * 이메일 영구 삭제
   */
  async hardDeleteEmail(input: { id: string }) {
    console.log('🗑️ 이메일 영구 삭제 요청:', input);
    return await this.gmailService.hardDelete(input);
  }
  
  /**
   * 초안 작성
   */
  async createDraft(input: {
    to: string | string[];
    subject: string;
    body: string;
    cc?: string | string[];
    bcc?: string | string[];
  }) {
    console.log('📝 이메일 초안 작성 요청:', input);
    
    const gmailInput = {
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      body: input.body,
      cc: input.cc ? (Array.isArray(input.cc) ? input.cc : [input.cc]) : undefined,
      Bcc: input.bcc ? (Array.isArray(input.bcc) ? input.bcc : [input.bcc]) : undefined,
    };
    
    return await this.gmailService.createDraft(gmailInput);
  }
}
