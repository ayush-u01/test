import { setAccessToken } from "./setAccessToken";
import { setRefreshToken } from "./setRefreshToken";
import { verifyAccessToken } from "./verifyAccessToken";
import { verifyRefreshToken } from "./verifyRefreshToken";
interface Payload {
  authid: string;
  email: string | null;
  phoneNo: string | null;
}
interface DecodedToken {
  authid: string;
}
export {
  Payload,
  DecodedToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAccessToken,
  setRefreshToken,
};
