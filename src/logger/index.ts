import log4js from "log4js";
import { config } from "./log4js.config";

log4js.configure(config);

export const logger = log4js.getLogger();