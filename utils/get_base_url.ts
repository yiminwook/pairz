import getConfig from "next/config";

export const getBaseURL = (isServer: boolean): string => {
  if (isServer) {
    const { PROTOCOL, HOST, PORT } = process.env;
    return `${PROTOCOL}://${HOST}:${PORT}`;
  } else {
    const { publicRuntimeConfig } = getConfig();
    const { PROTOCOL, HOST, PORT } = publicRuntimeConfig;
    return `${PROTOCOL}://${HOST}:${PORT}`;
  }
};
