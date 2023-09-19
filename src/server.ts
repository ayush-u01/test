import { App } from "app";
import { AuthRoute, ChatRoute, PasswordRoute, PdfRoute } from "./Modules";

const app = new App([
  new AuthRoute(),
  new PasswordRoute(),
  new PdfRoute(),
]);

app.listen();
