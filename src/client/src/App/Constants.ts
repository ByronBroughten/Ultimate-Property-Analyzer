const dev = {
  appName: "Analyzer Client — Development",
  endpoint: "http://localhost:5000",
  frontEndUrlBase: "http://localhost:3000",
};
// do I need the front-end endpoint?

const prod = {
  appName: "Analyzer Client — Production",
  endpoint: "https://www.dealanalyzer.app",
  frontEndUrlBase: "https://www.dealanalyzer.app",
};

const baseEnvStuff = process.env.NODE_ENV === "development" ? dev : prod;
const apiPathBit = "/api";

export const config = {
  appName: baseEnvStuff.appName,
  frontEndUrlBase: baseEnvStuff.frontEndUrlBase,
  apiPathBit: apiPathBit,
  apiPathFull: `${baseEnvStuff.endpoint}${apiPathBit}`,
  products: {},
  upgradeUserToPro: {
    costInCents: 1000,
    priceId: "price_1LOqZQBcSOBChcCBoh0Taacn",
  },
  costInCents: {
    // this needs to match the charge amount in stripe for the product.
    upgradeUserToPro: 1000,
  },
  basicStorageLimit: 2,
  apiQueryNames: [
    // "updateLogin",
    "register",
    "login",
    "addSection",
    "updateSection",
    "getSection",
    "deleteSection",
    "replaceSectionArr",
    "upgradeUserToPro",
  ],
  tokenKey: {
    sectionsState: "sections-state",
    sectionsConfigHash: "sections-config-hash",
    apiUserAuth: "x-auth-token",
    analyzerState: "analyzer-state",
    analyzerConfigHash: "analyzer-config-hash",
  },
} as const;

export const constants = config;
