import cors from "cors";
import express from "express";
import morgan from "morgan";
import type { Request, Response } from "express";
import type { Config } from "interfaces/config.interfaces";
import { Route } from "interfaces/route.interfaces";
import { getConfig } from "config";
import { globalConstants } from "./lib/constants";
import { logger } from "lib/logger";
import { errorMiddleware } from "middlewares/error.middleware";

export class App {
  public app: express.Application;
  public port: number;
  public config: Config;
  public env: string;

  constructor(routes: Route[]) {
    this.config = getConfig();
    this.app = express();
    this.env = this.config.env;
    this.port = this.config.server.port;
    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.initializeRouteFallback();
    this.initializeErrorHandling();

    this.disableSettings();
  }

  private initializeMiddleware() {
    const corsOptions = {
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
        "X-Refresh-Token",
        "Authorization",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Methods",
      ],
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      preflightContinue: true,
      origin: "*",
    };
    this.app.use(morgan(this.config.log.format));
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use("/api", route.router);
    });
  }

  private disableSettings(): void {
    this.app.disable("x-powered-by");
  }

  private initializeRouteFallback() {
    this.app.use((req, res) => {
      res.status(globalConstants.statusCode.NotFoundException.code).json({
        status: globalConstants.status.failed,
        message: "route not found ",
        data: null,
      });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(
        `🚀 Server listening on http://${this.config.server.host}:${this.port}`
      );
    });
  }
}
