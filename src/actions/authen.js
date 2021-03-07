import { LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_EXPIRED } from "../config/types";
import { signIn } from "../services/AuthenService";
import { redirect } from "./redirect";

const requestLogin = (userName, password, isRememberMe) => async (dispatch) => {
  const response = await signIn(userName, password).catch((err) => {
    dispatch({
      type: LOGIN_ERROR,
      payload: err.response.data,
    });
  });

  if (response && response.data.access_token) {
    if (isRememberMe) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    const accessToken = response.data.access_token;
    const role = JSON.parse(atob(accessToken.split(".")[1])).role;

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        ...response.data,
        role,
      },
    });
    dispatch(redirect("/dashboard"));
  }
};

const setLoginExpired = () => (dispatch) => {
  dispatch({
    type: LOGIN_EXPIRED,
    isAuth: false,
  });
};

export { requestLogin, setLoginExpired };
