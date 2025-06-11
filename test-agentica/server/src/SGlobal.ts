import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Singleton } from "tstl";
import typia from "typia";

export class SGlobal {
  public static get env(): IEnvironments {
    return environments.get();
  }
}

interface IEnvironments {
  OPENAI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  MODEL_PROVIDER?: "openai" | "openrouter";
  MODEL_NAME?: string;
  PORT: `${number}`;

  // Existing service credentials
  DISCORD_TOKEN?: string;
  FIGMA_CLIENT_ID?: string;
  FIGMA_CLIENT_SECRET?: string;
  FIGMA_REFRESH_TOKEN?: string;
  GITHUB_ACCESS_TOKEN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
  GOOGLE_API_KEY?: string;
  SERP_API_KEY?: string;
  KAKAO_MAP_CLIENT_ID?: string;
  KAKAO_NAVI_CLIENT_ID?: string;
  KAKAO_TALK_CLIENT_ID?: string;
  KAKAO_TALK_CLIENT_SECRET?: string;
  KAKAO_TALK_REFRESH_TOKEN?: string;
  NAVER_BLOG_CLIENT_ID?: string;
  NAVER_BLOG_CLIENT_SECRET?: string;
  NAVER_CAFE_CLIENT_ID?: string;
  NAVER_CAFE_CLIENT_SECRET?: string;
  NAVER_NEWS_CLIENT_ID?: string;
  NAVER_NEWS_CLIENT_SECRET?: string;
  NOTION_API_KEY?: string;
  STABLE_DIFFUSION_ENGINE_ID?: string;
  STABLE_DIFFUSION_HOST?: string;
  STABLE_DIFFUSION_API_KEY?: string;
  STABLE_DIFFUSION_DEFAULT_STEP?: string;
  STABLE_DIFFUSION_CFG_SCALE?: string;
}

const environments = new Singleton(() => {
  const env = dotenv.config();
  dotenvExpand.expand(env);
  return typia.assert<IEnvironments>(process.env);
});
