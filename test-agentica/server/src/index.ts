import { Agentica, IAgenticaHistoryJson } from "@agentica/core";
import { AgenticaOpenAIVectorStoreSelector } from "@agentica/openai-vector-store";
import {
  AgenticaRpcService,
  IAgenticaRpcListener,
  IAgenticaRpcService,
} from "@agentica/rpc";
import { DallE3Service } from "@wrtnlabs/connector-dall-e-3";
import { DiscordService } from "@wrtnlabs/connector-discord";
import { DiscordWrapperService } from "./services/DiscordWrapperService";
import { FigmaService } from "@wrtnlabs/connector-figma";
import { GithubService } from "@wrtnlabs/connector-github";
import { GmailService } from "@wrtnlabs/connector-gmail";
import { GmailWrapperService } from "./services/GmailWrapperService";
import { GoogleCalendarService } from "@wrtnlabs/connector-google-calendar";
import { GoogleDocsService } from "@wrtnlabs/connector-google-docs";
import { GoogleDriveService } from "@wrtnlabs/connector-google-drive";
import { GoogleMapService } from "@wrtnlabs/connector-google-map";
import { GoogleShoppingService } from "@wrtnlabs/connector-google-shopping";
import { GoogleTrendService } from "@wrtnlabs/connector-google-trend";
import { KakaoMapService } from "@wrtnlabs/connector-kakao-map";
import { KakaoNaviService } from "@wrtnlabs/connector-kakao-navi";
import { KakaoTalkService } from "@wrtnlabs/connector-kakao-talk";
import { NaverBlogService } from "@wrtnlabs/connector-naver-blog";
import { NaverCafeService } from "@wrtnlabs/connector-naver-cafe";
import { NaverNewsService } from "@wrtnlabs/connector-naver-news";
import { NotionService } from "@wrtnlabs/connector-notion";
import { StableDiffusionBetaService } from "@wrtnlabs/connector-stable-diffusion-beta";
import { YoutubeOfficialSearchService } from "@wrtnlabs/connector-youtube-official-search";
import { YoutubeSearchService } from "@wrtnlabs/connector-youtube-search";
import OpenAI from "openai";
import { WebSocketServer } from "tgrid";
import typia, { Primitive } from "typia";

import { SGlobal } from "./SGlobal";
import { FileManager } from "./services/FileManager";

const getPromptHistories = async (
  id: string,
): Promise<Primitive<IAgenticaHistoryJson>[]> => {
  // GET PROMPT HISTORIES FROM DATABASE
  id;
  return [];
};

// Model configuration helper
const getModelConfig = () => {
  const provider = SGlobal.env.MODEL_PROVIDER || "openai";
  const modelName = SGlobal.env.MODEL_NAME || "gpt-4o-mini";

  if (provider === "openrouter") {
    if (!SGlobal.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is required when using OpenRouter");
      process.exit(1);
    }

    return {
      api: new OpenAI({
        apiKey: SGlobal.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Agentica Server",
        },
      }),
      model: modelName, 
    };
  } else {
    if (!SGlobal.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is required when using OpenAI");
      process.exit(1);
    }

    return {
      api: new OpenAI({ apiKey: SGlobal.env.OPENAI_API_KEY }),
      model: modelName,
    };
  }
};

const main = async (): Promise<void> => {
  const modelConfig = getModelConfig();
  console.log(
    `Using ${SGlobal.env.MODEL_PROVIDER || "openai"} with model: ${modelConfig.model}`,
  );

  // Initialize FileManager for services that need it
  const fileManager = new FileManager();
  const server: WebSocketServer<
    null,
    IAgenticaRpcService<"chatgpt">,
    IAgenticaRpcListener
  > = new WebSocketServer();

  await server.open(Number(SGlobal.env.PORT), async (acceptor) => {
    const url: URL = new URL(`http://localhost${acceptor.path}`);

    const agent: Agentica<"chatgpt"> = new Agentica({
      model: "chatgpt",
      vendor: modelConfig,
      config: {
        locale: "ko-KR",
      },      controllers: [
        // {
        //   name: "DallE3 Connector",
        //   protocol: "class",
        //   application: typia.llm.application<DallE3Service, "chatgpt">(),
        //   execute: new DallE3Service({
        //     openai: modelConfig.api,
        //   }),
        // },
        {
          name: "Discord Connector",
          protocol: "class",
          application: typia.llm.application<DiscordWrapperService, "chatgpt">(),
          execute: new DiscordWrapperService({
            discordToken: SGlobal.env.DISCORD_TOKEN || "",
          }),
        },
        // {
        //   name: "Figma Connector",
        //   protocol: "class",
        //   application: typia.llm.application<FigmaService, "chatgpt">(),
        //   execute: new FigmaService({
        //     figmaClientId: SGlobal.env.FIGMA_CLIENT_ID || "",
        //     figmaClientSecret: SGlobal.env.FIGMA_CLIENT_SECRET || "",
        //     figmaRefreshToken: SGlobal.env.FIGMA_REFRESH_TOKEN || "",
        //   }),
        // },
        {
           name: "Github Connector",
           protocol: "class",
           application: typia.llm.application<GithubService, "chatgpt">(),
           execute: new GithubService({
             githubAccessToken: SGlobal.env.GITHUB_ACCESS_TOKEN || "",
           }),
         },
        {
          name: "Gmail Connector",
          protocol: "class",
          application: typia.llm.application<GmailWrapperService, "chatgpt">(),
          execute: new GmailWrapperService({
            googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
            googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
            googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
          }),
        },
        {
           name: "GoogleCalendar Connector",
           protocol: "class",
           application: typia.llm.application<GoogleCalendarService,"chatgpt">(),
           execute: new GoogleCalendarService({
             googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
             googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
             googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
           }),
        },
        {
           name: "GoogleDocs Connector",
           protocol: "class",
           application: typia.llm.application<GoogleDocsService, "chatgpt">(),
           execute: new GoogleDocsService({
             googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
             googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
             googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
           }),
        },
        {
          name: "GoogleDrive Connector",
           protocol: "class",
           application: typia.llm.application<GoogleDriveService, "chatgpt">(),
           execute: new GoogleDriveService({
             googleClientId: SGlobal.env.GOOGLE_CLIENT_ID || "",
             googleClientSecret: SGlobal.env.GOOGLE_CLIENT_SECRET || "",
             googleRefreshToken: SGlobal.env.GOOGLE_REFRESH_TOKEN || "",
           }),
        },
        {
           name: "GoogleMap Connector",
           protocol: "class",
           application: typia.llm.application<GoogleMapService, "chatgpt">(),
           execute: new GoogleMapService({
             googleApiKey: SGlobal.env.GOOGLE_API_KEY || "",
             serpApiKey: SGlobal.env.SERP_API_KEY || "",
           }),
        },
        {
           name: "GoogleShopping Connector",
           protocol: "class",
           application: typia.llm.application<GoogleShoppingService,"chatgpt">(),
           execute: new GoogleShoppingService({
             serpApiKey: SGlobal.env.SERP_API_KEY || "",
           }),
        },
        {
           name: "GoogleTrend Connector",
           protocol: "class",
           application: typia.llm.application<GoogleTrendService, "chatgpt">(),
           execute: new GoogleTrendService({
             serpApiKey: SGlobal.env.SERP_API_KEY || "",
           }),
        },
        {
           name: "KakaoMap Connector",
           protocol: "class",
           application: typia.llm.application<KakaoMapService, "chatgpt">(),
           execute: new KakaoMapService({
             kakaoMapClientId: SGlobal.env.KAKAO_MAP_CLIENT_ID || "",
           }),
        },
        {
           name: "KakaoNavi Connector",
           protocol: "class",
           application: typia.llm.application<KakaoNaviService, "chatgpt">(),
           execute: new KakaoNaviService({
             kakaoNaviClientId: SGlobal.env.KAKAO_NAVI_CLIENT_ID || "",
           }),
        },
        {
           name: "KakaoTalk Connector",
           protocol: "class",
           application: typia.llm.application<KakaoTalkService, "chatgpt">(),
           execute: new KakaoTalkService({
             kakaoTalkClientId: SGlobal.env.KAKAO_TALK_CLIENT_ID || "",
             kakaoTalkClientSecret: SGlobal.env.KAKAO_TALK_CLIENT_SECRET || "",
             kakaoTalkRefreshToken: SGlobal.env.KAKAO_TALK_REFRESH_TOKEN || "",
           }),
        },
        // {
        //   name: "NaverBlog Connector",
        //   protocol: "class",
        //   application: typia.llm.application<NaverBlogService, "chatgpt">(),
        //   execute: new NaverBlogService({
        //     naverBlogClientId: SGlobal.env.NAVER_BLOG_CLIENT_ID || "",
        //     naverBlogClientSecret: SGlobal.env.NAVER_BLOG_CLIENT_SECRET || "",
        //   }),
        // },
        // {
        //   name: "NaverCafe Connector",
        //   protocol: "class",
        //   application: typia.llm.application<NaverCafeService, "chatgpt">(),
        //   execute: new NaverCafeService({
        //     naverCafeClientId: SGlobal.env.NAVER_CAFE_CLIENT_ID || "",
        //     naverCafeClientSecret: SGlobal.env.NAVER_CAFE_CLIENT_SECRET || "",
        //   }),
        // },
        {
           name: "NaverNews Connector",
           protocol: "class",
           application: typia.llm.application<NaverNewsService, "chatgpt">(),
           execute: new NaverNewsService({
             naverNewsClientId: SGlobal.env.NAVER_NEWS_CLIENT_ID || "",
             naverNewsClientSecret: SGlobal.env.NAVER_NEWS_CLIENT_SECRET || "",
           }),
        },
        {
           name: "Notion Connector",
           protocol: "class",
           application: typia.llm.application<NotionService, "chatgpt">(),
           execute: new NotionService({
             notionApiKey: SGlobal.env.NOTION_API_KEY || "",
           }),
        },
        // {
        //   name: "StableDiffusionBeta Connector",
        //   protocol: "class",
        //   application: typia.llm.application<
        //     StableDiffusionBetaService,
        //     "chatgpt"
        //   >(),
        //   execute: new StableDiffusionBetaService({
        //     stableDiffusionEngineId: SGlobal.env.STABLE_DIFFUSION_ENGINE_ID || "",
        //     stableDiffusionHost: SGlobal.env.STABLE_DIFFUSION_HOST || "",
        //     stableDiffusionApiKey: SGlobal.env.STABLE_DIFFUSION_API_KEY || "",
        //     stableDiffusionDefaultStep: SGlobal.env.STABLE_DIFFUSION_DEFAULT_STEP || "30",
        //     stableDiffusionCfgScale: SGlobal.env.STABLE_DIFFUSION_CFG_SCALE || "7",
        //   }, fileManager),
        // },
        // {
        //   name: "YoutubeOfficialSearch Connector",
        //   protocol: "class",
        //   application: typia.llm.application<
        //     YoutubeOfficialSearchService,
        //     "chatgpt"
        //   >(),
        //   execute: new YoutubeOfficialSearchService({
        //     youtubeOfficialSearchGoogleApiKey: SGlobal.env.GOOGLE_API_KEY || "",
        //   }),
        // },
       {
          name: "YoutubeSearch Connector",
          protocol: "class",
          application: typia.llm.application<YoutubeSearchService, "chatgpt">(),
          execute: new YoutubeSearchService({
            serpApiKey: SGlobal.env.SERP_API_KEY || "",
          }),
        },
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
