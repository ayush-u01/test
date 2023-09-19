import prisma from "lib/prisma-client";
import { SafeChat, SafeGetChat } from "interfaces/types";
import { ChatDto, updateChatDto } from "./dto/chat.dto";
import { error } from "console";
import { Prisma } from "@prisma/client";
const { Configuration, OpenAIApi } = require("openai");

export class ChatService {
  private readonly prisma = prisma;
  private configuration = new Configuration({
    organization: "org-ABcLjLFcOkWHXVg6dvPuln4K",
    apiKey: "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",
  });
  private openai = new OpenAIApi(this.configuration);
  constructor() {}

  public async Chat(data: ChatDto) {
    try {
      const pdf = await this.prisma.pdf.findUnique({
        where: { pId: data.pId },
      });
      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Context: ${pdf?.text};  Question: ${data.prompt}, based on the context answer the question and provide a reply in markdown text format`,
          },
        ],
      });
      return completion.data.choices[0].message.content;
    } catch (err) {
      throw err;
    }
  }

  public async updateChat(data: updateChatDto) {
    try {
      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `${data.prompt}, kindly generate a reply under 100 words`,
          },
        ],
      });
      return completion.data.choices[0].message.content;
    } catch (err) {
      throw err;
    }
  }

  public async CreateChat(data: ChatDto): Promise<SafeChat> {
    const chatData: string = await this.Chat(data);
    const chat = await this.prisma.document.create({
      data: {
        chat: [data.prompt, chatData],
        authId: data.authId,
      },
      select: {
        documentId: true,
        chat: true,
        authId: true,
      },
    });

    const response = {
      document: chat,
    };
    return response as SafeChat;
  }

  public async FetchChat(data: { documentId: string }): Promise<SafeChat> {
    const chat = await this.prisma.document.findUnique({
      where: { documentId: data.documentId },
    });
    const response = {
      document: chat,
    };
    return response as SafeChat;
  }

  public async GetChat(data: { authId: string }): Promise<SafeGetChat> {
    const chat = await this.prisma.document.findMany({
      where: { authId: data.authId },
      select: {
        documentId: true,
        chat: true,
        authId: true,
      },
    });
    const response = {
      document: chat,
    };
    return response as SafeGetChat;
  }

  public async UpdateChat(data: updateChatDto): Promise<SafeChat> {
    const chatData: string = await this.updateChat(data);
    const res = await this.prisma.document.findUnique({
      where: { documentId: data.documentId },
    });
    let update;
    if (res?.chat) {
      const chat = await this.prisma.document.update({
        where: { documentId: data.documentId },
        data: {
          chat: {
            set: [...res?.chat, data.prompt, chatData],
          },
        },
        select: {
          documentId: true,
          chat: true,
          authId: true,
        },
      });
      update = chat;
    }

    const response = {
      document: update,
    };
    return response as SafeChat;
  }
}
