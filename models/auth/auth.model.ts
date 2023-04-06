import CustomServerError from "@/controllers/error/custom_server_error";
import FirebaseAdmin from "../firebase_admin";

const auth = FirebaseAdmin.getInstance().Auth;

const verifyCookie = async (cookie: string) => {
  try {
    const decodeCookie = await auth.verifySessionCookie(cookie);
    return decodeCookie;
  } catch (err) {
    throw new CustomServerError({
      statusCode: 307,
      message: "VerifyCookie Error",
      location: "/timeout",
    });
  }
};

const verifyToken = async (idToken: string) => {
  try {
    const decodeToken = await auth.verifyIdToken(idToken);
    return decodeToken;
  } catch (err) {
    throw new CustomServerError({
      statusCode: 307,
      message: "VerifyToken Error",
      location: "/timeout",
    });
  }
};

const authModel = {
  verifyCookie,
  verifyToken,
};

export default authModel;
