import { IsString } from "class-validator";

export class PdfDto {
  @IsString()
  readonly authId: string;
}

export class deletePdfDto {
  @IsString()
  readonly pId: string;
}
