import prisma from "lib/prisma-client";
import { SafePdf } from "interfaces/types";
import { PdfDto, deletePdfDto } from "./dto/pdf.dto";
import { Pdf } from "@prisma/client";
import { File } from "buffer";
import fs from "fs";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");
const pdf = require("pdf-parse");

interface PDFObject {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: Object;
  size: number;
}

export class PdfService {
  private readonly prisma = prisma;

  public async fileUpload(files: File) {
    const file: PDFObject[] = Object.values(files)[0];
    let fileData;
    const path = file[0].path;
    const blob = fs.readFileSync(path);
    try {
      await new Upload({
        client: new S3Client({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
          region: process.env.S3_REGION,
        }),
        params: {
          ACL: "public-read",
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `${file[0].originalFilename}`,
          Body: blob,
        },
        tags: [], // optional tags
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
      })
        .done()
        .then((data: any) => {
          fileData = {
            name: "complete",
            value: data,
            location: data.Location,
          };
        });
      return fileData;
    } catch (err) {
      throw err;
    }
  }

  public async extractTextFromPDF(pdfFilePath: string) {
    try {
      // Read the PDF file
      const pdfData = await fs.promises.readFile(pdfFilePath);

      // Parse the PDF
      const pdfParser = await pdf(pdfData);

      // Extract text from the PDF
      const pdfText = pdfParser.text;

      return pdfText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw error;
    }
  }

  public async CreateChat(files: File, field: PdfDto): Promise<SafePdf> {
    const data: any = await this.fileUpload(files);
    const file: PDFObject[] = Object.values(files)[0];
    const path = file[0].path;
    const textData: string = await this.extractTextFromPDF(path);
    const res = await this.prisma.pdf.create({
      data: {
        text: textData,
        link: String(data?.location),
        authId: field.authId[0],
      },
      select: {
        pId: true,
        text: true,
        link: true,
        authId: true,
        createdAt: true,
      },
    });

    const response = {
      pdf: res,
    };
    return response as SafePdf;
  }

  public async FetchChat(data: { pId: string }): Promise<SafePdf> {
    const chat = await this.prisma.pdf.findUnique({
      where: { pId: data.pId },
    });
    const response = {
      pdf: chat,
    };
    return response as SafePdf;
  }

  public async GetChat(data: { authId: string }): Promise<Pdf[]> {
    const response = await this.prisma.pdf.findMany({
      where: { authId: data.authId },
      select: {
        pId: true,
        text: true,
        link: true,
        authId: true,
        createdAt: true,
      },
    });

    return response as Pdf[];
  }

  public async UpdateChat(data: deletePdfDto): Promise<SafePdf> {
    const res = await this.prisma.pdf.delete({
      where: { pId: data.pId },
    });

    const response = {
      pdf: res,
    };
    return response as SafePdf;
  }
}
