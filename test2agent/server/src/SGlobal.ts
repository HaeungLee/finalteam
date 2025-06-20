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
  PORT: `${number}`;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_S3_BUCKET?: string;
  AWS_S3_REGION?: string;
  CALENDLY_CLIENT_ID?: string;
  CALENDLY_CLIENT_SECRET?: string;
  CALENDLY_REFRESH_TOKEN?: string;
  DAUM_API_KEY?: string;
  DISCORD_TOKEN?: string;
  FIGMA_CLIENT_ID?: string;
  FIGMA_CLIENT_SECRET?: string;
  FIGMA_REFRESH_TOKEN?: string;
  GITHUB_ACCESS_TOKEN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
  GOOGLE_ADS_PARENT_SECRET?: string;
  GOOGLE_ADS_ACCOUNT_ID?: string;
  GOOGLE_ADS_DEVELOPER_TOKEN?: string;
  SERP_API_KEY?: string;
  GOOGLE_API_KEY?: string;
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
  ZENROWS_API_KEY?: string;
  X_CLIENT_ID?: string;
  X_CLIENT_SECRET?: string;
  X_BEARER_TOKEN?: string;
}

const environments = new Singleton(() => {
  const env = dotenv.config();
  dotenvExpand.expand(env);
  return typia.assert<IEnvironments>(process.env);
});
