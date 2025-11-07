import { Router } from "express";
import { ChatMemberController } from "@/api/controllers/chat-member.controller";
import protectedRoute from "@/core/authentication/protected-route";

const router = Router();
const chatMemberController = new ChatMemberController();
export default (app: Router) => {
  app.use("/chat-member", router);
  router.post("/join", protectedRoute(chatMemberController.join));
};
