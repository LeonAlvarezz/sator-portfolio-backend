import { db, type DrizzleTransaction } from "@/db";
import { siteMetric } from "@/db/schema/site-metric.schema";
import type { DailyMetric, TotalMetric } from "@/types/statistic.type";
import { and, between, eq, gt, sql } from "drizzle-orm";

export class SiteMetricRepository {
  public async getTotalBySiteUser(
    site_user_id: string
  ): Promise<Partial<TotalMetric>> {
    const result = await db
      .select({
        total_site_views: sql<number>`COALESCE(SUM(${siteMetric.view}), 0)`,
      })
      .from(siteMetric)
      .where(eq(siteMetric.site_user_id, site_user_id));

    return {
      total_site_views: result[0]?.total_site_views || 0,
    };
  }
  public async getDailyBySiteUser(
    site_user_id: string
  ): Promise<DailyMetric[]> {
    const results = await db
      .select({
        site_views: sql<number>`SUM(${siteMetric.view})::INTEGER`,
        created_at: sql<Date>`DATE_TRUNC('day', ${siteMetric.created_at})`,
      })
      .from(siteMetric)
      .where(
        and(
          gt(siteMetric.created_at, sql`NOW() - INTERVAL '30 days'`),
          eq(siteMetric.site_user_id, site_user_id)
        )
      )
      .groupBy(sql`DATE_TRUNC('day', ${siteMetric.created_at})`)
      .orderBy(sql`created_at`);

    return results as DailyMetric[];
  }

  public async findByToday(site_user_id: string, tx?: DrizzleTransaction) {
    const client = tx ? tx : db;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return await client.query.siteMetric.findFirst({
      where: and(
        eq(siteMetric.site_user_id, site_user_id),
        between(siteMetric.created_at, today, tomorrow)
      ),
    });
  }

  public async createMetric(site_id: string, tx?: DrizzleTransaction) {
    const client = tx ? tx : db;
    const [result] = await client
      .insert(siteMetric)
      .values({
        site_user_id: site_id,
        view: 1,
      })
      .returning();
    return result;
  }

  public async increaseView(id: string, tx?: DrizzleTransaction) {
    const client = tx ? tx : db;
    return await client
      .update(siteMetric)
      .set({
        view: sql`COALESCE(${siteMetric.view}, 0) + 1`,
      })
      .where(eq(siteMetric.id, id));
  }
}
