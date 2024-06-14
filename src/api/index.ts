import { Router } from "express";
import recieveCommand from "./routes/recieveCommand";

// guaranteed to get dependencies
export default () => {
  const app = Router();
  recieveCommand(app);

  return app;
};
