import MockAdapter from "axios-mock-adapter";

import instance from "./axios";
import { getList, addTodo, updateTodo, deleteTodo } from "./todoAxios";

const mock = new MockAdapter(instance);

describe("Test Todo Axios", () => {
  test("Get List", async () => {
    const data = [{ id: 1, title: "test todo list", isCompleted: false }];
    mock.onGet("/todo").reply(200, data);

    const response = await getList();
    expect(response).toEqual(data);
  });

  //

  test("Post Add Todo", async () => {
    const data = { id: 1, title: "test todo list", isCompleted: false };
    mock.onPost("/todo", { title: "test todo list" }).reply(201, data);

    const response = await addTodo({ title: "test todo list" });
    expect(response).toEqual(data);
  });

  //

  test("Post update Todo", async () => {
    const data = { id: 1, title: "updated", isCompleted: false };
    mock
      .onPatch("/todo", { id: 1, title: "updated", isCompleted: false })
      .reply(201, data);

    const response = await updateTodo({
      id: 1,
      title: "updated",
      isCompleted: false,
    });
    expect(response.data).toEqual(data);
  });

  //

  test("Post delete Todo", async () => {
    mock.onDelete("/todo/1").reply(200);

    const response = await deleteTodo({ id: 1 });
    expect(response.status).toBe(200);
  });
});
