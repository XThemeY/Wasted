import { IHeaders, IJwtPayload } from '#interfaces/IFields';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
      headers: IHeaders;
    }
  }
}
