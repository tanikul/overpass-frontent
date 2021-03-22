// URL config
export const MOCK_API_URL = "http://localhost:8000";
//export const PROD_API_URL = "https://backend.th.app.ruk-com.cloud";

export const PROD_API_URL = "http://localhost:8080";
// common config
export const LOCALE = "TH-th";
export const LOGIN_FAILED_CODE = "9999";
export const userFullAccess = ["SUPER_ADMIN"];
export const roleUserControl = {
  SUPER_ADMIN: ["ADMIN", "USER"],
  ADMIN: ["USER"],
};

export const SUPER_ADMIN_ROLE = "SUPER_ADMIN";
export const ADMIN_ROLE = "ADMIN";
export const USER_ROLE = "USER";


export const API_KEY_GOOGLE_MAP = "AIzaSyANe0OjAC6ILZQGF9udm0BlN0QHW1JMMME";