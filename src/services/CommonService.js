import axios from "axios";
import { LOCALE, PROD_API_URL, MOCK_API_URL } from "../config";
import ls from 'local-storage';
import { setLoginExpired } from '../actions/authen';
import { redirect } from "../actions/redirect";

import { useDispatch } from "react-redux";

axios.defaults.headers.common["Accept-Language"] = LOCALE;

const API_URL = PROD_API_URL;
// process.env.NODE_ENV !== "development" ? PROD_API_URL : MOCK_API_URL;

export const post = (path, body = {}, headers) => {
  
    return axios({
      method: 'post',
      responseType: 'json',
      url: `${PROD_API_URL}/${path}`,
      data: body,
      headers
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      if(error.response.status === 401){
        localStorage.clear();
      }
      console.log(error.response);
      return error.response;
    });
};

export const get = (path, query = "", headers) => {
  return axios.get(`${API_URL}/${path}${query !== "" ? `?${query}` : ""}`, {
    headers,
  }).then(response => {
     return response;
   }).catch(error =>{
    if(error.response.status === 401){
      localStorage.clear();
    }
    console.log(error.response);
    return error.response;
  });
};

export const getRoles = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await get("api/master/role", "", headers);
    return response;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
};

export const getStatuses = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await get("api/master/status", "", headers);
    return response;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
};

export const getPrefixes = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await get("api/master/prefix", "", headers);
    return response;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
};

export const getOrganizations = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await get("api/master/organization", "", headers);
    return response;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
};

export const getDistricts = async (token, amphurId) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await get("api/master/district?amphurId=" + amphurId, "", headers);
    return response;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
};

export const getAmphurs = async (token, provinceId) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await get("api/master/amphur?provinceId=" + provinceId, "", headers);
    return response;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
};

export const getProvinces = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await get("api/master/province", "", headers);
    return response;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
};

export const getMappingAddress = async (token) => {
  if(ls.get("address") === null){
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await get("api/master/mappingAddress", "", headers);
      ls.set("address", response.data);
      return response;
    } catch (err) {
      console.log(err.response);
      return err.response;
    }
  }else{
    return {'status': 200, 'data': ls.get("address")};
  }
  
};

export const getProvinceId = (provinces, id) => {
  return provinces.find((province) => province.value === id).key || -1;
};

export const getAmphurId = (amphurs, id) => {
  return amphurs.find((amphur) => amphur.value === id).key || -1;
};

export const getDistrictId = (districts, id) => {
  return districts.find((district) => district.value === id).key || -1;
};

export const getRoleId = (roles, roleName) => {
  return roles.find((role) => role.value === roleName).key || -1;
};

export const getPrefixId = (prefixes, prefixName) => {
  return prefixes.find((prefix) => prefix.value === prefixName).key || -1;
};

export const getOrganizationId = (organizations, organizationName) => {
  return (
    organizations.find(
      (organization) => organization.value === organizationName
    ).key || -1
  );
};


export const subscription = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const request = await post(
      "subscription",
      "",
      headers
    );console.log(request);
    return request;
  } catch (err) {
    return err.response.data;
  }
};