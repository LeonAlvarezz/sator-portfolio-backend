import { SiteUserController } from "@/modules/site-user/site-user.controller";
import protectedRoute from "@/core/authentication/protected-route";
import { Router } from "express";

const router = Router();
const siteUserController = new SiteUserController();
export default (app: Router) => {
  app.use("/site-user", router);
  router.get("/", protectedRoute(siteUserController.paginateSiteUsers));
  router.post("/", protectedRoute(siteUserController.createSiteUsers));
};
