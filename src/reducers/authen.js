import { LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_EXPIRED } from "../config/types";

const initialState = {
  access_token: "",
  error: {},
  isAuth: false,
};

const authenReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...action.payload,
        isAuth: true,
      };
    case LOGIN_ERROR:
      return {
        error: { ...action.payload },
        isAuth: false,
      };
    case LOGIN_EXPIRED:
      return {
        isAuth: false,
      };
    default:
      return state;
  }
};

export default authenReducer;
