import { Agentica, IAgenticaHistoryJson } from "@agentica/core";
import {
  AgenticaRpcService,
  IAgenticaRpcListener,
  IAgenticaRpcService,
} from "@agentica/rpc";
import OpenAI from "openai";
import { WebSocketServer } from "tgrid";
import typia, { Primitive } from "typia";

import { SGlobal } from "./SGlobal";

// import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";
// import { CalendlyService } from "@wrtnlabs/connector-calendly";
// import { DaumBlogService } from "@wrtnlabs/connector-daum-blog";
// import { DaumCafeService } from "@wrtnlabs/connector-daum-cafe";
import { DiscordService } from "@wrtnlabs/connector-discord";
// import { ExcelService } from "@wrtnlabs/connector-excel";
// import { FigmaService } from "@wrtnlabs/connector-figma";
import { GithubService } from "@wrtnlabs/connector-github";
import { GmailService } from "@wrtnlabs/connector-gmail";
// import { GoogleAdsService } from "@wrtnlabs/connector-google-ads";
import { GoogleCalendarService } from "@wrtnlabs/connector-google-calendar";
import { GoogleDocsService } from "@wrtnlabs/connector-google-docs";
import { GoogleDriveService } from "@wrtnlabs/connector-google-drive";
// import { GoogleFlightService } from "@wrtnlabs/connector-google-flight";
// import { GoogleHotelService } from "@wrtnlabs/connector-google-hotel";
// import { GoogleImageService } from "@wrtnlabs/connector-google-image";
// import { GoogleMapService } from "@wrtnlabs/connector-google-map";
// import { GoogleScholarService } from "@wrtnlabs/connector-google-scholar";
import { GoogleSheetService } from "@wrtnlabs/connector-google-sheet";
// import { GoogleSlidesService } from "@wrtnlabs/connector-google-slides";
import { GoogleTrendService } from "@wrtnlabs/connector-google-trend";
import { GoogleSearchService } from "@wrtnlabs/connector-google-search";
import { GoogleShoppingService } from "@wrtnlabs/connector-google-shopping";
import { KakaoMapService } from "@wrtnlabs/connector-kakao-map";
// import { KakaoNaviService } from "@wrtnlabs/connector-kakao-navi";
import { KakaoTalkService } from "@wrtnlabs/connector-kakao-talk";
// import { NaverBlogService } from "@wrtnlabs/connector-naver-blog";
// import { NaverCafeService } from "@wrtnlabs/connector-naver-cafe";
// import { NaverNewsService } from "@wrtnlabs/connector-naver-news";
import { NotionService } from "@wrtnlabs/connector-notion";
// import { WebCrawlerService } from "@wrtnlabs/connector-web-crawler";
// import { YoutubeOfficialSearchService } from "@wrtnlabs/connector-youtube-official-search";
// import { YoutubeSearchService } from "@wrtnlabs/connector-youtube-search";
// import { XService } from "@wrtnlabs/connector-x";

// Service factory functions
/*
const createAwsS3Service = () => {
  const props = {
    awsAccessKeyId: SGlobal.env.AWS_ACCESS_KEY_ID || "",
    awsSecretAccessKey: SGlobal.env.AWS_SECRET_ACCESS_KEY || "",
    awsS3Bucket: SGlobal.env.AWS_S3_BUCKET || "",
    awsS3Region: SGlobal.env.AWS_S3_REGION || "us-east-1",
  };
  return new AwsS3Service(props);
};

const createCalendlyService = () => {
  const props = {
    calendlyClientId: SGlobal.env.CALENDLY_CLIENT_ID || "",
    calendlyClientSecret: SGlobal.env.CALENDLY_CLIENT_SECRET || "",
    calendlyRefreshToken: SGlobal.env.CALENDLY_REFRESH_TOKEN || "",
  };
  return new CalendlyService(props);
};

const createDaumBlogService = () => {
  const props = {
    daumApiKey: SGlobal.env.DAUM_API_KEY || "",
  };
  return new DaumBlogService(props);
};

const createDaumCafeService = () => {
  const props = {
    daumApiKey: SGlobal.env.DAUM_API_KEY || "",
  };
  return new DaumCafeService(props);
};
*/

const createDiscordService = () => {
  const props = {
    discordToken: SGlobal.env.DISCORD_TOKEN || "",
  };
  return new DiscordService(props);
};

/*
const createExcelService = () => {
  const fileManager = {
    upload: async (file: any) => ({ url: "", uri: "" }),
    download: async (url: string) => new ArrayBuffer(0),
    read: async (input: any) => ({ data: Buffer.from(new ArrayBuffer(0)) }),
    isMatch: (input: any) => true,
  };
  const props = {
    googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
    googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
    fileManager,
  };
  return new ExcelService(props);
};

const createFigmaService = () => {
  const props = {
    figmaClientId: SGlobal.env.FIGMA_CLIENT_ID || "",
    figmaClientSecret: SGlobal.env.FIGMA_CLIENT_SECRET || "",
    figmaRefreshToken: SGlobal.env.FIGMA_REFRESH_TOKEN || "",
  };
  return new FigmaService(props);
};
*/

const createGithubService = () => {
  const props = {
    githubAccessToken: SGlobal.env.GITHUB_ACCESS_TOKEN || "",
  };
  return new GithubService(props);
};

const createGmailService = () => {
  const props = {
    googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
    googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
  };
  return new GmailService(props);
};

/*
const createGoogleAdsService = () => {
  const props = {
    googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
    googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
    googleAdsDeveloperToken: SGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
    googleAdsParentSecret: SGlobal.env.GOOGLE_ADS_PARENT_SECRET || "",
    googleAdsAccountId: SGlobal.env.GOOGLE_ADS_ACCOUNT_ID || "",
  };
  return new GoogleAdsService(props);
};
*/

const createGoogleCalendarService = () => {
  const props = {
    googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
    googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
  };
  return new GoogleCalendarService(props);
};

const createGoogleDocsService = () => {
  const props = {
    googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
    googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
  };
  return new GoogleDocsService(props);
};

const createGoogleDriveService = () => {
  const props = {
    googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
    googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
  };
  return new GoogleDriveService(props);
};

/*
const createGoogleFlightService = () => {
  const props = {
    serpApiKey: SGlobal.env.SERP_API_KEY || "",
  };
  return new GoogleFlightService(props);
};

const createGoogleHotelService = () => {
  const props = {
    serpApiKey: SGlobal.env.SERP_API_KEY || "",
  };
  return new GoogleHotelService(props);
};

const createGoogleImageService = () => {
  const props = {
    serpApiKey: SGlobal.env.SERP_API_KEY || "",
  };
  return new GoogleImageService(props);
};

const createGoogleMapService = () => {
  const props = {
    serpApiKey: SGlobal.env.SERP_API_KEY || "",
    googleApiKey: SGlobal.env.GOOGLE_API_KEY || "",
  };
  return new GoogleMapService(props);
};
*/
/*
const createGoogleScholarService = () => {
  const props = {
    serpApiKey: SGlobal.env.SERP_API_KEY || "",
  };
  return new GoogleScholarService(props);
};
*/

const createGoogleSearchService = () => {
  const props = {
    googleApiKey: SGlobal.env.GOOGLE_API_KEY || "",
    serpApiKey: SGlobal.env.SERP_API_KEY || "",
  };
  return new GoogleSearchService(props);
};

const createGoogleShoppingService = () => {
  const props = {
    serpApiKey: SGlobal.env.SERP_API_KEY || "",
  };
  return new GoogleShoppingService(props);
};

const createGoogleSheetService = () => {
  const props = {
    googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
    googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
  };
  return new GoogleSheetService(props);
};

/*
const createGoogleShoppingService = () => {
  const props = {
    serpApiKey: SGlobal.env.SERP_API_KEY || "",
  };
  return new GoogleShoppingService(props);
};

const createGoogleSlidesService = () => {
  const props = {
    googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
    googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
  };
  // GoogleSlidesService requires FileManager as second parameter
  const fileManager = {
    upload: async (file: any) => ({ url: "", uri: "" }),
    download: async (url: string) => new ArrayBuffer(0),
    read: async (input: any) => ({ data: Buffer.from(new ArrayBuffer(0)) }),
    isMatch: (input: any) => true,
  };
  return new GoogleSlidesService(props, fileManager);
};
*/
  const createGoogleTrendService = () => {
    const props = {
      serpApiKey: SGlobal.env.SERP_API_KEY || "",
    };
    return new GoogleTrendService(props);
  };

const createKakaoMapService = () => {
  const props = {
    kakaoMapClientId: SGlobal.env.KAKAO_MAP_CLIENT_ID || "",
  };
  return new KakaoMapService(props);
};

// const createKakaoNaviService = () => {
//   const props = {
//     kakaoNaviClientId: SGlobal.env.KAKAO_NAVI_CLIENT_ID || "",
//   };
//   return new KakaoNaviService(props);
// };

const createKakaoTalkService = () => {
  const props = {
    kakaoTalkClientId: SGlobal.env.KAKAO_TALK_CLIENT_ID || "",
    kakaoTalkClientSecret: SGlobal.env.KAKAO_TALK_CLIENT_SECRET || "",
    kakaoTalkRefreshToken: SGlobal.env.KAKAO_TALK_REFRESH_TOKEN || "",
  };
  return new KakaoTalkService(props);
};

// const createNaverBlogService = () => {
//   const props = {
//     naverBlogClientId: SGlobal.env.NAVER_BLOG_CLIENT_ID || "",
//     naverBlogClientSecret: SGlobal.env.NAVER_BLOG_CLIENT_SECRET || "",
//   };
//   return new NaverBlogService(props);
// };

// const createNaverCafeService = () => {
//   const props = {
//     naverCafeClientId: SGlobal.env.NAVER_CAFE_CLIENT_ID || "",
//     naverCafeClientSecret: SGlobal.env.NAVER_CAFE_CLIENT_SECRET || "",
//   };
//   return new NaverCafeService(props);
// };

// const createNaverNewsService = () => {
//   const props = {
//     naverNewsClientId: SGlobal.env.NAVER_NEWS_CLIENT_ID || "",
//     naverNewsClientSecret: SGlobal.env.NAVER_NEWS_CLIENT_SECRET || "",
//   };
//   return new NaverNewsService(props);
// };

const createNotionService = () => {
  const props = {
    notionApiKey: SGlobal.env.NOTION_API_KEY || "",
  };
  return new NotionService(props);
};

/*
const createWebCrawlerService = () => {
  const props = {
    zenrowsApiKey: SGlobal.env.ZENROWS_API_KEY || "",
  };
  return new WebCrawlerService(props);
};

const createYoutubeOfficialSearchService = () => {
  const props = {
    youtubeOfficialSearchGoogleApiKey: SGlobal.env.GOOGLE_API_KEY || "",
  };
  return new YoutubeOfficialSearchService(props);
};

const createYoutubeSearchService = () => {
  const props = {
    serpApiKey: SGlobal.env.SERP_API_KEY || "",
  };
  return new YoutubeSearchService(props);
};

const createXService = () => {
  const props = {
    xClientId: SGlobal.env.X_CLIENT_ID || "",
    xClientSecret: SGlobal.env.X_CLIENT_SECRET || "",
    xBearerToken: SGlobal.env.X_BEARER_TOKEN || "",
  };
  return new XService(props);
};
*/

const getPromptHistories = async (
  id: string,
): Promise<Primitive<IAgenticaHistoryJson>[]> => {
  // GET PROMPT HISTORIES FROM DATABASE
  id;
  return [];
};

const main = async (): Promise<void> => {
  if (SGlobal.env.OPENAI_API_KEY === undefined)
    console.error("env.OPENAI_API_KEY is not defined.");

  const server: WebSocketServer<
    null,
    IAgenticaRpcService<"chatgpt">,
    IAgenticaRpcListener
  > = new WebSocketServer();
  await server.open(Number(SGlobal.env.PORT), async (acceptor) => {
    const url: URL = new URL(`http://localhost${acceptor.path}`);
    
    // 🎯 OpenAI API 클라이언트 초기화 (로깅 제거)
    const openai = new OpenAI({
      apiKey: SGlobal.env.OPENAI_API_KEY,
      maxRetries: 3,
      timeout: 30000
    });

    // 🚫 프록시 로깅 완전 제거 - TTS를 위해 깔끔한 출력 필요
    // const originalCompletions = openai.chat.completions;
    // openai.chat.completions = new Proxy(originalCompletions, {
    //   get(target, prop) {
    //     if (prop === 'create') {
    //       return function(body: any, options?: any) {
    //         console.log("OpenAI API 요청 파라미터:", JSON.stringify(body, null, 2));
    //         
    //         // Call the original method
    //         const result = originalCompletions.create.call(originalCompletions, body, options);
    //         
    //         // Add logging for non-streaming responses
    //         if (!body.stream) {
    //           result.then((response: any) => {
    //             if (response?.usage) {
    //               console.log("OpenAI API 응답 토큰 사용량:",
    //                 `사용: ${response.usage.completion_tokens}, ` +
    //                 `총: ${response.usage.total_tokens}`
    //               );
    //             }
    //             return response;
    //           }).catch((error: any) => {
    //             console.error("OpenAI API 호출 중 오류 발생:", error);
    //             throw error;
    //           });
    //         } else {
    //           console.log("OpenAI API 스트리밍 응답 시작");
    //         }
    //         
    //         return result;
    //       };
    //     }
    //     return (target as any)[prop];
    //   }
    // });

    // @ts-ignore - Using type assertion to bypass TypeScript errors for model parameters
    const agent: Agentica<"chatgpt"> = new Agentica({
      model: "chatgpt",
      vendor: {
        api: openai,
        model: "gpt-4o-mini", //gpt-4.1-nano-2025-04-14,
        // Set OpenAI parameters directly in the vendor object
        max_tokens: 100,   // 🎯 TTS를 위해 조금 늘림 (50 → 100)
        temperature: 0.1, // 🎯 더 일관된 출력 (0.3 → 0.1)
        top_p: 0.7       // 🎯 더 집중된 응답 (0.8 → 0.7)
      } as any,  // Type assertion to bypass TypeScript errors
      config: {
        locale: "ko-KR",
        executor: {
          // 🎯 describe를 true로 되돌리되, systemPrompt로 제어
          describe: true,
        },
        systemPrompt: {
          common: () => `당신은 한국어로만 응답하는 간결한 어시스턴트입니다.

🚨 절대 규칙 🚨
- 모든 응답은 반드시 한국어로만 작성
- 영어 단어나 문장 절대 금지
- Function call 결과도 한국어로만 간단히 설명
- 최대 2-3문장으로 간결하게 답변

응답 예시:
- 성공: "메일을 성공적으로 보냈습니다."
- 실패: "메일 전송에 실패했습니다."
- 정보 제공: "총 5개의 파일을 찾았습니다."`,
          
          execute: () => `한국어로만 간결하게 응답하세요. 영어 사용 금지.`,
          
          describe: () => `함수 실행 결과를 한국어로 1문장으로만 간단히 설명하세요. 
예시: "메일 전송이 완료되었습니다." 또는 "작업이 성공했습니다."
영어나 긴 설명은 절대 금지입니다.`,
          
          // 🎯 추가 프롬프트들도 한국어로 강제
          initialize: () => `한국어로만 간결하게 응답하세요. 영어 사용 금지.`,
          
          select: () => `한국어로만 간결하게 응답하세요. 영어 사용 금지.`
        }
      },
      controllers: [
        /*
        {
          name: "AwsS3 Connector",
          protocol: "class",
          application: typia.llm.application<AwsS3Service, "chatgpt">(),
          execute: createAwsS3Service(),
        },
        {
          name: "Calendly Connector",
          protocol: "class",
          application: typia.llm.application<CalendlyService, "chatgpt">(),
          execute: createCalendlyService(),
        },
        {
          name: "DaumBlog Connector",
          protocol: "class",
          application: typia.llm.application<DaumBlogService, "chatgpt">(),
          execute: createDaumBlogService(),
        },
        {
          name: "DaumCafe Connector",
          protocol: "class",
          application: typia.llm.application<DaumCafeService, "chatgpt">(),
          execute: createDaumCafeService(),
        },
        */
        {
          name: "Discord Connector",
          protocol: "class",
          application: typia.llm.application<DiscordService, "chatgpt">(),
          execute: createDiscordService(),
        },
        /*
        {
          name: "Excel Connector",
          protocol: "class",
          application: typia.llm.application<ExcelService, "chatgpt">(),
          execute: createExcelService(),
        },
        {
          name: "Figma Connector",
          protocol: "class",
          application: typia.llm.application<FigmaService, "chatgpt">(),
          execute: createFigmaService(),
        },
        */
        {
          name: "Github Connector",
          protocol: "class",
          application: typia.llm.application<GithubService, "chatgpt">(),
          execute: createGithubService(),
        },
        {
          name: "Gmail Connector",
          protocol: "class",
          application: typia.llm.application<GmailService, "chatgpt">(),
          execute: createGmailService(),
        },
        /*
        {
          name: "GoogleAds Connector",
          protocol: "class",
          application: typia.llm.application<GoogleAdsService, "chatgpt">(),
          execute: createGoogleAdsService(),
        },
        */
        {
          name: "GoogleCalendar Connector",
          protocol: "class",
          application: typia.llm.application<GoogleCalendarService, "chatgpt">(),
          execute: createGoogleCalendarService(),
        },
        {
          name: "GoogleDocs Connector",
          protocol: "class",
          application: typia.llm.application<GoogleDocsService, "chatgpt">(),
          execute: createGoogleDocsService(),
        },
        {
          name: "GoogleDrive Connector",
          protocol: "class",
          application: typia.llm.application<GoogleDriveService, "chatgpt">(),
          execute: createGoogleDriveService(),
        },
        /*
        {
          name: "GoogleFlight Connector",
          protocol: "class",
          application: typia.llm.application<GoogleFlightService, "chatgpt">(),
          execute: createGoogleFlightService(),
        },
        {
          name: "GoogleHotel Connector",
          protocol: "class",
          application: typia.llm.application<GoogleHotelService, "chatgpt">(),
          execute: createGoogleHotelService(),
        },
        {
          name: "GoogleImage Connector",
          protocol: "class",
          application: typia.llm.application<GoogleImageService, "chatgpt">(),
          execute: createGoogleImageService(),
        {
          name: "GoogleMap Connector",
          protocol: "class",
          application: typia.llm.application<GoogleMapService, "chatgpt">(),
          execute: createGoogleMapService(),
        },
        {
          name: "GoogleScholar Connector",
          protocol: "class",
          application: typia.llm.application<GoogleScholarService, "chatgpt">(),
          execute: createGoogleScholarService(),
        },
        */
        {
          name: "GoogleSearch Connector",
          protocol: "class",
          application: typia.llm.application<GoogleSearchService, "chatgpt">(),
          execute: createGoogleSearchService(),
        },
        {
          name: "GoogleSheet Connector",
          protocol: "class",
          application: typia.llm.application<GoogleSheetService, "chatgpt">(),
          execute: createGoogleSheetService(),
        },
        
        {
          name: "GoogleShopping Connector",
          protocol: "class",
          application: typia.llm.application<GoogleShoppingService,"chatgpt">(),
          execute: createGoogleShoppingService(),
        },
        /*
        {
          name: "GoogleSlides Connector",
          protocol: "class",
          application: typia.llm.application<GoogleSlidesService, "chatgpt">(),
          execute: createGoogleSlidesService(),
        },
        */
        {
          name: "GoogleTrend Connector",
          protocol: "class",
          application: typia.llm.application<GoogleTrendService, "chatgpt">(),
          execute: createGoogleTrendService(),
        },
        
        {
          name: "KakaoMap Connector",
          protocol: "class",
          application: typia.llm.application<KakaoMapService, "chatgpt">(),
          execute: createKakaoMapService(),
        },
        // {
        //   name: "KakaoNavi Connector",
        //   protocol: "class",
        //   application: typia.llm.application<KakaoNaviService, "chatgpt">(),
        //   execute: createKakaoNaviService(),
        // },
        {
          name: "KakaoTalk Connector",
          protocol: "class",
          application: typia.llm.application<KakaoTalkService, "chatgpt">(),
          execute: createKakaoTalkService(),
        },
        // {
        //   name: "NaverBlog Connector",
        //   protocol: "class",
        //   application: typia.llm.application<NaverBlogService, "chatgpt">(),
        //   execute: createNaverBlogService(),
        // },
        // {
        //   name: "NaverCafe Connector",
        //   protocol: "class",
        //   application: typia.llm.application<NaverCafeService, "chatgpt">(),
        //   execute: createNaverCafeService(),
        // },
        // {
        //   name: "NaverNews Connector",
        //   protocol: "class",
        //   application: typia.llm.application<NaverNewsService, "chatgpt">(),
        //   execute: createNaverNewsService(),
        // },
        {
          name: "Notion Connector",
          protocol: "class",
          application: typia.llm.application<NotionService, "chatgpt">(),
          execute: createNotionService(),
        },
        /*
        {
          name: "WebCrawler Connector",
          protocol: "class",
          application: typia.llm.application<WebCrawlerService, "chatgpt">(),
          execute: createWebCrawlerService(),
        },
        {
          name: "YoutubeOfficialSearch Connector",
          protocol: "class",
          application: typia.llm.application<
            YoutubeOfficialSearchService,
            "chatgpt"
          >(),
          execute: createYoutubeOfficialSearchService(),
        },
        {
          name: "YoutubeSearch Connector",
          protocol: "class",
          application: typia.llm.application<YoutubeSearchService, "chatgpt">(),
          execute: createYoutubeSearchService(),
        },
        {
          name: "X Connector",
          protocol: "class",
          application: typia.llm.application<XService, "chatgpt">(),
          execute: createXService(),
        },
        */
      ],
      histories:
        // check {id} parameter
        url.pathname === "/"
          ? []
          : await getPromptHistories(url.pathname.slice(1)),
    });
    const service: AgenticaRpcService<"chatgpt"> = new AgenticaRpcService({
      agent,
      listener: acceptor.getDriver(),
    });
    
    await acceptor.accept(service);
  });
};
main().catch(console.error);
