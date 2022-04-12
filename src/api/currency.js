import ls from "localstorage-slim";

ls.config.encrypt = true;

export const getCurrency = () => {
  return ls.get("currency");
};

export const setCurrency = (currency) => {
  ls.set("currency", currency);
};

export const removeCurrency = () => {
  ls.remove("currency");
};
