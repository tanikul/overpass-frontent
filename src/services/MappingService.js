import { post, get } from "./CommonService";

export const insertMappingOverpasses = async (token, body = {}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const request = await post(
      "api/mapping/insertMapGroupAndOverpass",
      body,
      headers
    );
    return request;
  } catch (err) {
    return err.response.data;
  }
};

export const updateMappingOverpasses = async (token, body = {}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const request = await post(
        "api/mapping/updateMapGroupAndOverpass",
        body,
        headers
      );
      return request;
    } catch (err) {
      return err.response.data;
    }
  };

  export const getOverpassByGroupId = async (token, body = {}) => {
    const headers = {
        Authorization: `Bearer ${token}`,
      };
    
      try {
        const request = await get(
          "api/mapping/getOverPassByGroupId", "groupId=" + body,
          headers
        );
        return request;
      } catch (err) {
        return err.response.data;
      }
  };
  

  export const getsearchGroupMappingOverpasses = async (token, body = {}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const filter = body.filter;
  
    try {
      const request = await post(
        "api/mapping/searchMappingOverPass",
        filter ? { ...body } : { ...body, filter: {} },
        headers
      );
      return request.data;
    } catch (err) {
      return err.response.data;
    }
  };

  export const getMappingOverPassAll = async (token) => {
    const headers = {
        Authorization: `Bearer ${token}`,
      };
    
      try {
        const request = await get(
          "api/mapping/getMappingOverPassAll", "",
          headers
        );
        return request;
      } catch (err) {
        return err.response.data;
      }
  };
  
  export const deleteMappingOverpasses = async (token, body = {}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const request = await post(
        "api/mapping/deleteMapGroupAndOverpass",
        body,
        headers
      );
      return request;
    } catch (err) {
      return err.response.data;
    }
  };