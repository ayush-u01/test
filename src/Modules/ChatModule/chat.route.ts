import { ChatController } from "./chat.controller";
import { Router } from "express";
import type { Route } from "interfaces/route.interfaces";
import { createValidationPipe } from "middlewares/request-validator";
import { ChatDto, updateChatDto } from "./dto/chat.dto";

export class ChatRoute implements Route {
  public path = "/chat";
  public router = Router();
  public chatController = new ChatController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      createValidationPipe(ChatDto),
      this.chatController.ChatHandler
    );
    this.router.post(`${this.path}/fetch`, this.chatController.FetchHandler);
    this.router.post(`${this.path}/get`, this.chatController.GetHandler);
    this.router.post(
      `${this.path}/update`,
      createValidationPipe(updateChatDto),
      this.chatController.UpdateHandler
    );
  }
}
