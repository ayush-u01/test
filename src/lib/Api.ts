import { Response } from "express";
import { getConfig } from "config";
import { logger } from "./logger";
import { globalConstants } from "./constants";
import { Status } from "interfaces/globalConstants.interfaces";
abstract class Api {
  public send<T>(
    res: Response,
    data: T,
    message: string = "Stay Healthy",
    status: string = globalConstants.status.success,
    statusCode: number = globalConstants.statusCode.HttpsStatusCodeOk.code
  ) {
    if (getConfig().env === "development") {
      // need to change based on environment
      logger.info(JSON.stringify(data, null, 2));
    }

    return res.status(statusCode).json({
      status,
      message,
      data,
    });
  }
}

export default Api;
