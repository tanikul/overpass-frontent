import { post, get } from "./CommonService";

export const insertAnswerOverpass = async (token, body = {}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const filter = body.filter;
  
    try {
      const request = await post(
        "api/answer/insertAnswerOverpass",
        body,
        headers
      );
      return request;
    } catch (err) {
      return err.response.data;
    }
};

export const getAnswerByOverpassStatusId = async (token, id) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const request = await get(
        "api/answer/getAnswerByOverpassStatusId", `id=${id}`,
        headers
      );
      return request;
    } catch (err) {
      return err.response.data;
    }
  };

  export const getOverpassStatusById = async (token, id) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const request = await get(
        "api/answer/getOverpassStatusById", `id=${id}`,
        headers
      );
      return request;
    } catch (err) {
      return err.response.data;
    }
  };