import axios, { AxiosResponse } from "axios";

export const validatonToken = async (): Promise<boolean> => {
  const authResult: AxiosResponse<{ isLoggin: boolean }> = await axios.get(
    "/api/auth",
    { withCredentials: true }
  );
  if (authResult.status !== 200 || !authResult.data.isLoggin) {
    throw new Error("Loggin Error");
  }
  return authResult.data.isLoggin;
};
