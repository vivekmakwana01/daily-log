import type { AppBindings } from "./types.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>({
    strict: false,
  });

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
