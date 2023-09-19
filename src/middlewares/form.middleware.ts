import { File } from "buffer";
import { NextFunction, Request, Response } from "express";
import multiparty, { Form } from "multiparty";

export async function FormMiddleWare(
  req: any,
  res: Response,
  next: NextFunction
) {
  const form = new multiparty.Form();

  await form.parse(req, function (err: Error, fields: any, files: File) {
    req.files = files;
    req.body = fields;
    next();
  });
}
