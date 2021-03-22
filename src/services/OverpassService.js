import { post, get } from "./CommonService";

export const getOverpasses = async (token, body = {}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const filter = body.filter;

  try {
    const request = await post(
      "api/overpass/searchOverpass",
      filter ? { ...body } : { ...body, filter: {} },
      headers
    );
    return request.data;
  } catch (err) {
    return err.response.data;
  }
};

export const searchOverpassesByUserId = async (token, body = {}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const filter = body.filter;

  try {
    const request = await post(
      "api/overpass/searchOverpassesByUserId",
      body,
      headers
    );
    return request;
  } catch (err) {
    return err.response.data;
  }
};

export const getOverpassesAll = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const request = await get(
      "api/overpass", "",
      headers
    );
    return request;
  } catch (err) {
    return err.response.data;
  }
};

export const getOverpassesByCond = async (token, provinceId = null, amphurId = null, districtId = null) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    var array = [];
    if(provinceId !== null && provinceId !== ""){
      array.push("provinceId=".concat(provinceId));
    }
    if(amphurId !== null && amphurId !== ""){
      array.push("amphurId=".concat(amphurId));
    }
    if(districtId !== null && districtId !== ""){
      array.push("districtId=".concat(districtId));
    }
    let q = "";
    if(array.length > 0){
      array.forEach((item, i) => {
        q += item.concat("&");
      });
      q = q.substring(0, q.length - 1);
    }
    const request = await get(
      "api/overpass", q,
      headers
    );
    return request;
  } catch (err) {
    return err.response.data;
  }
};

export const editOverpass = async (token, body = {}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await post("api/overpass/update", body, headers);
    return response;
  } catch (err) {
    return err.response;
  }
};

export const addOverpass = async (token, body = {}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await post("api/overpass/save", body, headers);
    return response;
  } catch (err) {
    return err.response.data;
  }
};

export const deleteOverpass = async (token, id) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const body = new FormData();
  body.append("id", id);

  try {
    const response = await post("api/overpass/delete", body, headers);
    return response;
  } catch (err) {
    return err.response.data;
  }
};

export const getLightBulbAll = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const request = await get(
      "api/overpass/getLightBulb", "",
      headers
    );
    return request;
  } catch (err) {
    return err.response.data;
  }
};
export const getOverpassStatusByGroupId = async (token, overpassGroup) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const request = await get(
      "api/overpass/getOverpassStatusByGroupId", `groupId=${overpassGroup}`,
      headers
    );
    return request;
  } catch (err) {
    return err.response.data;
  }
};