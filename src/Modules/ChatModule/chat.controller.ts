import { NextFunction, Request, RequestHandler, Response } from "express";
import { ChatService } from "./chat.service";
import { CustomResponse } from "interfaces/response.interface";
import Api from "lib/Api";
import { Document } from "@prisma/client";

export class ChatController extends Api {
  private chatService: ChatService;
  constructor() {
    super();
    this.chatService = new ChatService();
  }

  public ChatHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Document>>,
    next: NextFunction
  ) => {
    try {
      const Chat = await this.chatService.CreateChat(req.body);
      this.send(res, Chat, "conversation for OpenAI");
    } catch (error) {
      next(error);
    }
  };

  public FetchHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Document>>,
    next: NextFunction
  ) => {
    try {
      const Chat = await this.chatService.FetchChat(req.body);
      this.send(res, Chat, "chat fetched for OpenAI");
    } catch (error) {
      next(error);
    }
  };

  public GetHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Document>>,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
      const Chat = await this.chatService.GetChat(req.body);
      this.send(res, Chat, "chat fetched for OpenAI");
    } catch (error) {
      next(error);
    }
  };

  public UpdateHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Document>>,
    next: NextFunction
  ) => {
    try {
      const Chat = await this.chatService.UpdateChat(req.body);
      this.send(res, Chat, "chat updated for OpenAI");
    } catch (error) {
      next(error);
    }
  };
}
