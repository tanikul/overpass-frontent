import { LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_EXPIRED } from "../config/types";
import { signIn } from "../services/AuthenService";
import { redirect } from "./redirect";
import { messaging, subscribeTokenToTopic } from "../init-fcm";

const requestLogin = (userName, password, isRememberMe) => async (dispatch) => {
  localStorage.clear();
  const response = await signIn(userName, password).catch((err) => {
    dispatch({
      type: LOGIN_ERROR,
      payload: err.response.data,
    });
    return err.response;
  });

  if (response && response.data.access_token) {
    if (isRememberMe) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    const accessToken = response.data.access_token;
    const role = JSON.parse(atob(accessToken.split(".")[1])).role;
    const overpassGroup = JSON.parse(atob(accessToken.split(".")[1])).overpassGroup;
    const name = JSON.parse(atob(accessToken.split(".")[1])).name;
    const imageProfile = (JSON.parse(atob(accessToken.split(".")[1])).imageProfile === undefined) ? "" : JSON.parse(atob(accessToken.split(".")[1])).imageProfile;

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        ...response.data,
        role,
        overpassGroup,
        name,
        imageProfile,
      },
    });

     if(messaging !== null && overpassGroup !== undefined){
        try{
          await messaging.requestPermission();
          const token = await messaging.getToken();
          await subscribeTokenToTopic(token, `overpass-${overpassGroup}`);
        } catch (error) {
          console.error(error);
          //console.log("Unable to get permission to notify.", err);
        }
  
        navigator.serviceWorker.addEventListener("message", (message) => {
          this.showNotification(message);
        });
      }
    
    dispatch(redirect("/dashboard"));
  }else{
    return response;
  }
};

const setLoginExpired = () => (dispatch) => {
  dispatch({
    type: LOGIN_EXPIRED,
    isAuth: false,
  });
};

export { requestLogin, setLoginExpired };
