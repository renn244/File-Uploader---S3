import { UserSession } from "src/common/decorators/userSession.decorator";

declare global {
  namespace Express {
    interface Request {
      user?: UserSession;
    }
  }
}