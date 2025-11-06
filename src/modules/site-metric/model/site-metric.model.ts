import type { BaseModel } from "@/core/types/base.type";

export type DailyMetric = {
  portfolio_views: number;
  site_views: number;
  blog_views: number;
  created_at: Date;
};

export type TotalMetric = {
  total_portfolio_views: number;
  total_site_views: number;
  total_blog_views: number;
};

export type SiteMetric = BaseModel & {
  site_user_id: string;
  view: string;
};
