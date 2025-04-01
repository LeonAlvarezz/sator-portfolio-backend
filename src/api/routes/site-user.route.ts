import { Router } from "express";
import { SiteUserController } from "../controllers/site-user.controller";
import protectedRoute from "@/authentication/protected-route";

const router = Router();
const siteUserController = new SiteUserController();

export default (app: Router) => {
  app.use("/user/site-user", router);
  router.get("/", protectedRoute(siteUserController.paginateByUser));
};
