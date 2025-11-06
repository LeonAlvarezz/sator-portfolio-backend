import { StatisticController } from "@/api/controllers/statistic.controller";
import protectedSiteUserRoute from "@/core/authentication/protected-site-user-route";
import { Router } from "express";

const router = Router();
const statisticController = new StatisticController();
export default (app: Router) => {
  app.use("/statistic", router);
  router.get(
    "/total",
    protectedSiteUserRoute(statisticController.getTotalPortfolioMetric)
  );
  router.get(
    "/daily",
    protectedSiteUserRoute(statisticController.getDailyPortfolioMetric)
  );
};
