import { IsString } from "class-validator";

export class ChatDto {
  @IsString()
  readonly pId: string;

  @IsString()
  readonly authId: string;

  @IsString()
  readonly prompt: string;
}

export class updateChatDto {
  @IsString()
  readonly documentId: string;

  @IsString()
  readonly prompt: string;
}
