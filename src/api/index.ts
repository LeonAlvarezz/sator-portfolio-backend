import { Router, type Request, type Response } from "express";
import {
  adminRouteAdmin,
  adminRouteBlog,
  adminRouteCategory,
  adminRouteChatMember,
  adminRouteChatMessage,
  adminRouteChatRoom,
  adminRouteFormQuestion,
  adminRoutePortfolio,
  adminRouteResource,
  adminRouteRole,
  adminRouteUser,
  adminSiteUser,
  adminUnreadMessage,
} from "./routes/admin";
import {
  blog,
  chatMember,
  chatMessage,
  chatRoom,
  formAttempt,
  formQuestion,
  test,
  unreadMessage,
  user,
  siteUser,
} from "./routes";
import {
  siteUserRouteSiteUser,
  siteUserRouteBlog,
  siteUserRouteCategory,
  siteUserRoutePortfolio,
  siteUserRouteStatistic,
} from "./routes/site-user";

// guaranteed to get dependencies

export default () => {
  const app = Router();

  //Health Check
  app.get("/health-check", (_req: Request, res: Response) => {
    const data = {
      uptime: process.uptime(),
      message: "OK",
      date: new Date(),
    };
    res.status(200).send(data);
  });

  // User routes remain top-level
  user(app);
  chatRoom(app);
  chatMember(app);
  chatMessage(app);
  unreadMessage(app);
  formQuestion(app);
  formAttempt(app);
  blog(app);
  test(app);
  siteUser(app);

  // Site user routes group
  const siteUserRouter = Router();
  siteUserRouteSiteUser(siteUserRouter);
  siteUserRoutePortfolio(siteUserRouter);
  siteUserRouteCategory(siteUserRouter);
  siteUserRouteStatistic(siteUserRouter);
  siteUserRouteBlog(siteUserRouter);
  app.use("/site-user", siteUserRouter);

  // Admin routes group
  const adminRouter = Router();
  adminRouteAdmin(adminRouter);
  adminRouteRole(adminRouter);
  adminRouteBlog(adminRouter);
  adminRouteUser(adminRouter);
  adminRouteResource(adminRouter);
  adminRoutePortfolio(adminRouter);
  adminRouteCategory(adminRouter);
  adminRouteFormQuestion(adminRouter);
  adminRouteChatRoom(adminRouter);
  adminRouteChatMessage(adminRouter);
  adminRouteChatMember(adminRouter);
  adminUnreadMessage(adminRouter);
  adminSiteUser(adminRouter);
  app.use("/admin", adminRouter);

  return app;
};
