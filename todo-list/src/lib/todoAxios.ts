import instance from "./axios";

export interface Todo {
  id?: number;
  title?: string;
  isCompleted?: boolean;
}

export const getList = async (): Promise<Todo[]> => {
  try {
    const response = await instance.get("/todo");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to Get List");
  }
};

export const addTodo = async ({ title }: Todo): Promise<Todo> => {
  try {
    const response = await instance.post("/todo", { title });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to Add Todo");
  }
};

export const updateTodo = async ({ id, title, isCompleted }: Todo) => {
  try {
    const res = await instance.patch("/todo", { id, title, isCompleted });
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to Update Todo");
  }
};

export const deleteTodo = async ({ id }: Todo) => {
  try {
    const res = await instance.delete(`/todo/${id}`);
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to Delete Todo");
  }
};
