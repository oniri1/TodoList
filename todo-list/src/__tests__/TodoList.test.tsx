import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import TodoList from "../components/TodoList";
import instance from "../lib/axios";
import { updateTodo, deleteTodo } from "../lib/todoAxios";

const mock = new MockAdapter(instance);
const client = new QueryClient();

describe("Test Todo List", () => {
  const waitScr = async () => {
    await waitFor(() => {
      expect(screen.getByText("Todo List")).toBeInTheDocument();
      expect(
        (screen.getByTestId("inputFirst") as HTMLInputElement).value
      ).toEqual("");
    });
  };

  beforeEach(() => {
    const data = { id: 1, title: "test todo list", isCompleted: false };
    mock.onGet("/todo").reply(200, [data]);
    mock.onPost("/todo", { title: "test todo list" }).reply(200, data);
    mock.onPost("/todo", { title: "test todo2" }).reply(200, data);
    render(
      <QueryClientProvider client={client}>
        <TodoList />
      </QueryClientProvider>
    );
  });

  test("Render Todo List", async () => {
    const titleElem = screen.getByText(/now Loading/i);
    expect(titleElem).toBeInTheDocument();
    expect(titleElem.tagName).toBe("DIV");

    await waitFor(() => {
      expect(screen.getByText("Todo List")).toBeInTheDocument();
    });
    expect(screen.getByText(/test todo list/i)).toBeInTheDocument();
  });

  test("Include Input Element", async () => {
    await waitFor(() => {
      expect(screen.getByText("Todo List")).toBeInTheDocument();
    });
    const inputElem = screen.getByTestId("inputFirst");
    expect(inputElem).toBeInTheDocument();
  });

  test("Input Text", async () => {
    await waitFor(() => {
      expect(screen.getByText("Todo List")).toBeInTheDocument();
    });
    const inputElem: HTMLInputElement = screen.getByTestId("inputFirst");
    fireEvent.change(inputElem, { target: { value: "input test" } });
    expect(inputElem.value).toEqual("input test");
  });

  test("Include Add Button", () => {
    const buttonElem = screen.getByRole("button", { name: "Add Todo" });
    expect(buttonElem).toBeInTheDocument();
  });

  test("Add New Todo", async () => {
    // 작성해보자
    const data = { id: 1, title: "test todo list", isCompleted: false };
    mock
      .onGet("/todo")
      .reply(200, [data, { id: 2, title: "first Todo", isCompleted: false }]);

    await waitFor(() => {
      expect(screen.getByText("Todo List")).toBeInTheDocument();
    });
    const inputElem: HTMLInputElement = screen.getByTestId("inputFirst");
    fireEvent.change(inputElem, { target: { value: "test todo list" } });
    const buttonElem = screen.getByRole("button", { name: "Add Todo" });
    fireEvent.click(buttonElem);

    fireEvent.change(inputElem, { target: { value: "test todo2" } });
    fireEvent.click(buttonElem);

    await waitFor(() => {
      expect(screen.getByText("Todo List")).toBeInTheDocument();
      expect(
        (screen.getByTestId("inputFirst") as HTMLInputElement).value
      ).toEqual("");
    });

    const listItemElem = screen.getByText("first Todo");
    expect(listItemElem).toBeInTheDocument();
    expect(listItemElem.tagName).toBe("SPAN");
  });

  test("Update Todo", async () => {
    mock
      .onPatch("/todo", { id: 1, title: "Updated todo", isCompleted: false })
      .reply(200, { id: 1, title: "Updated todo", isCompleted: false });
    mock
      .onPatch("/todo", { id: 1, title: "Updated todo", isCompleted: true })
      .reply(200, { id: 1, title: "Updated todo", isCompleted: true });
    mock
      .onPatch("/todo", { id: 1, isCompleted: true })
      .reply(200, { id: 1, title: "Updated todo", isCompleted: true });
    mock
      .onPatch("/todo", { id: 1, title: "Updated todo" })
      .reply(200, { id: 1, title: "Updated todo", isCompleted: true });

    await waitScr();

    const checkbox: HTMLInputElement[] = screen.getAllByTestId("todobox");
    fireEvent.click(checkbox[0]);
    const updateInput: HTMLInputElement = screen.getByTestId("inputUpdate");
    fireEvent.change(updateInput, { target: { value: "Updated todo" } });
    const updateBtn = screen.getByText(/Update Todo/i);
    // screen.debug();
    fireEvent.click(updateBtn);

    await waitScr();

    const response = await updateTodo({
      id: 1,
      title: "Updated todo",
      isCompleted: false,
    });
    expect(response.data).toEqual({
      id: 1,
      title: "Updated todo",
      isCompleted: false,
    });

    const comChangeBtn = screen.getByText(/Completed Change/i);
    fireEvent.click(checkbox[0]);
    fireEvent.click(comChangeBtn);

    await waitScr();

    const response2 = await updateTodo({
      id: 1,
      title: "Updated todo",
      isCompleted: true,
    });
    expect(response2.data).toEqual({
      id: 1,
      title: "Updated todo",
      isCompleted: true,
    });
  });

  test("Delete Todo", async () => {
    await waitScr();

    const data = [{}];

    mock.onDelete("todo/1").reply(200, data);

    const checkbox: HTMLInputElement[] = screen.getAllByTestId("todobox");
    fireEvent.click(checkbox[0]);
    const deleteBtn = screen.getByText(/Delete/i);
    fireEvent.click(deleteBtn);

    await waitScr();

    const res = await deleteTodo({ id: 1 });
    expect(res.status).toEqual(200);
    expect(res.data).toEqual(data);
  });
});
