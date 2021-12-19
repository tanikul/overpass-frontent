import { post, get } from "./CommonService";
import axios from "axios";

export const getDataOverpass = async (token) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
      const request = await get(
        "api/dashboard/getDataOverpass", "",
        headers
      );
      return request;
    
};


export const send = async () => {
    const fetchOptions = {
          "collapse_key" : "type_a",
          "notification" : {
              "body" : "Body of Your Notification",
              "title": "Title of Your Notification",
              "icon": "http://www.liberaldictionary.com/wp-content/uploads/2019/02/icon-0326.jpg"
          },
          "data" : {
              "body" : "Body of Your Notification in Data",
              "title": "Title of Your Notification in Title",
              "key_1" : "Value for key_1",
              "key_2" : "Value for key_2"
          },
          "to": "eHmk3Bu1IU75wRI7ZTijSt:APA91bGtsfG4K7P_mNmuie03y27G8aoV9C26vLuSfC7rXmrh55CjE9fc7giaczYzuKtoAG5_LAZvfzh_qOCzVdS76jRsRjKwD2khSHL8WWkB92pexlGwVdwHLs35__Iy5_BFaFZGdWFx"
        
      };
      const headers = {
        "Authorization": `key=AAAAT6THNjA:APA91bEpVPiz1LpQUG0pY73PKowO8UyPCeVaV3aFusud1zMGUoeevW4BP-rwoGPqA2R72geNPWyBz7fqnkcr214OxXZovTB0gK937kEK66vJlgDejCp7J0iLAhVnWJuPgmwnnHXpvIWo`,
        "content-type": "application/json"
      };
      return axios.post(`https://fcm.googleapis.com/fcm/send`, fetchOptions, { headers });
     
};