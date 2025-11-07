import { BlogController } from "@/api/controllers/blog.controller";
import { Router } from "express";

const router = Router();
const blogController = new BlogController();

export default (app: Router) => {
  app.use("/blog", router);
  router.get("/", blogController.getAll);
  router.get("/:slug", blogController.getBlogBySlug);
  router.post("/:slug/view", blogController.increaseView);
};
