import axios from "axios";

const instance = axios.create({
  baseURL: "/todoList/api",
});

export default instance;
