import FirebaseAdmin from "./firebase_admin";

const auth = FirebaseAdmin.getInstance().Auth;

const verifyCookie = async (cookie: string) => {
  const decodeCookie = await auth.verifySessionCookie(cookie);
  return decodeCookie;
};

const verifyToken = async (idToken: string) => {
  const decodeToken = await auth.verifyIdToken(idToken);
  return decodeToken;
};

const authModel = {
  verifyCookie,
  verifyToken,
};

export default authModel;
