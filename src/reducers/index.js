import { combineReducers } from "redux";
import sidebar from "./sidebar";
import authen from "./authen";
import redirect from "./redirect";

export default combineReducers({
  sidebar,
  authen,
  redirect
});
