import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:5000/api",
  baseURL: "https://smart-leads-api-ttq2.onrender.com/api",
});

export default API;