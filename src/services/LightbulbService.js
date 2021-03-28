import { post, get } from "./CommonService";

export const saveLightBulb = async (token, body = {}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const request = await post(
      "api/lightbulb/save",
      body,
      headers
    );
    return request;
  } catch (err) {
    return err.response.data;
  }
};

export const updateLightBulb = async (token, body = {}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const request = await post(
        "api/lightbulb/update",
        body,
        headers
      );
      return request;
    } catch (err) {
      return err.response.data;
    }
  };

  export const deleteLightBulb = async (token, body = {}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const request = await post(
        "api/lightbulb/delete",
        body,
        headers
      );
      return request;
    } catch (err) {
      return err.response.data;
    }
  };

export const getLightBulbList = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const request = await get(
      "api/lightbulb/getLightBulbList",
      "",
      headers
    );
    return request;
  } catch (err) {
    return err.response.data;
  }
};
