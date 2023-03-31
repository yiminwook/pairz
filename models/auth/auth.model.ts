import FirebaseAdmin from "../firebase_admin";

const auth = FirebaseAdmin.getInstance().Auth;

const verifyCookie = async (cookie: string) => {
  try {
    const decodeCookie = await auth.verifySessionCookie(cookie);
    return decodeCookie;
  } catch (err) {
    throw new Error("verifyCookie Error!"); //401code
  }
};

const verifyToken = async (idToken: string) => {
  try {
    const decodeToken = await auth.verifyIdToken(idToken);
    return decodeToken;
  } catch (err) {
    throw new Error("verifyToken Error!"); //401code
  }
};

const authModel = {
  verifyCookie,
  verifyToken,
};

export default authModel;
