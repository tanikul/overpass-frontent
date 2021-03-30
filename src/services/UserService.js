import { post, get } from "./CommonService";

export const getUsers = async (token, body = {}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const filter = body.filter;

  try {
    const request = await post(
      "api/user/searchUser",
      filter ? { ...body } : { ...body, filter: {} },
      headers
    );
    return request.data;
  } catch (err) {
    return err.response.data;
  }
};

export const editUser = async (token, body = {}) => {
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-type": "multipart/form-data"
  };

  try {
    const response = await post("api/user/update", body, headers);
    return response;
  } catch (err) {
    return err.response;
  }
};

export const addUser = async (token, body = {}) => {
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-type": "multipart/form-data"
  };

  try {
    const response = await post("api/user/save", body, headers);
    return response;
  } catch (err) {
    return err.response.data;
  }
};

export const deleteUser = async (token, id) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const body = new FormData();
  body.append("id", id);

  try {
    const response = await post("api/user/delete", body, headers);
    return response;
  } catch (err) {
    return err.response.data;
  }
};

export const getUserByRole = async (token, query) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await get(
      `api/user`, query,
      headers
    );
    return response;
  } catch (err) {
    return err.response.data;
  }
};

export const changePassword = async (token, newPassword) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const body = new FormData();
    body.append("newPassword", newPassword);
    const response = await post("api/user/changePassword", body, headers);
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getUserByAuthen = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const request = await get(
      "api/user/getUserByAuthen","",headers
    );
    return request;
  } catch (err) {
    return err.response.data;
  }
};

export const updateUserProfile = async (token, body = {}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await post("api/user/updateUserProfile", body, headers);
    return response;
  } catch (err) {
    return err.response;
  }
};