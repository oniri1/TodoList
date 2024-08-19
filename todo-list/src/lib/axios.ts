import axios from "axios";

const instance = axios.create({
  baseURL: "/todoList/api",
  // baseURL: "http://localhost:8080/api",
});

export default instance;
