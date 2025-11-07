import { Router } from "express";
import { FormQuestionController } from "@/api/controllers/form-question.controller";

const router = Router();
const formQuestionController = new FormQuestionController();

export default (app: Router) => {
  app.use("/question", router);
  router.get("/:id", formQuestionController.findById);
};
