import { PdfController } from "./pdf.controller";
import { Router } from "express";
import type { Route } from "interfaces/route.interfaces";
import { createValidationPipe } from "middlewares/request-validator";
import { PdfDto, deletePdfDto } from "./dto/pdf.dto";
import { FormMiddleWare } from "middlewares/form.middleware";

export class PdfRoute implements Route {
  public path = "/pdf";
  public router = Router();
  public pdfController = new PdfController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      FormMiddleWare,
      this.pdfController.ChatHandler
    );
    this.router.post(`${this.path}/fetch`, this.pdfController.FetchHandler);
    this.router.post(`${this.path}/getAll`, this.pdfController.GetHandler);
    this.router.post(
      `${this.path}/delete`,
      createValidationPipe(deletePdfDto),
      this.pdfController.DeleteHandler
    );
  }
}
