import { REDIRECT } from "../config/types";

export const redirect = (link) => {
  return { type: REDIRECT, payload: link };
};
