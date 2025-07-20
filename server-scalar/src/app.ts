import createApp from "./lib/create-app.js";

const app = createApp();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/error", () => {
  throw new Error("This is an error");
});

export default app;
