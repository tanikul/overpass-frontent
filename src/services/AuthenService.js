import { post } from "./CommonService";

export const signIn = async (username, password) => {
  const body = new FormData();
  body.append("username", username);
  body.append("password", password);

  return await post("login", body);
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
