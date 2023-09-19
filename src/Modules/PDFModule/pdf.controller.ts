import { NextFunction, Request, RequestHandler, Response } from "express";
import { PdfService } from "./pdf.service";
import { CustomResponse } from "interfaces/response.interface";
import Api from "lib/Api";
import { Document, Pdf } from "@prisma/client";

export class PdfController extends Api {
  private pdfService: PdfService;
  constructor() {
    super();
    this.pdfService = new PdfService();
  }

  public ChatHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Pdf>>,
    next: NextFunction
  ) => {
    try {
      const Chat = await this.pdfService.CreateChat(req.files, req.body);
      this.send(res, Chat, "pdf created!");
    } catch (error) {
      next(error);
    }
  };

  public FetchHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Pdf>>,
    next: NextFunction
  ) => {
    try {
      const Chat = await this.pdfService.FetchChat(req.body);
      this.send(res, Chat, "pdfs fetched!");
    } catch (error) {
      next(error);
    }
  };

  public GetHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Pdf>>,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
      const Chat = await this.pdfService.GetChat(req.body);
      this.send(res, Chat, "pdf fetched!");
    } catch (error) {
      next(error);
    }
  };

  public DeleteHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Pdf>>,
    next: NextFunction
  ) => {
    try {
      const Chat = await this.pdfService.UpdateChat(req.body);
      this.send(res, Chat, "pdf deleted!");
    } catch (error) {
      next(error);
    }
  };
}
