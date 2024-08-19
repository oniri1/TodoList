import { useQuery } from "@tanstack/react-query";
import { getList, Todo as ITodo } from "../../lib/todoAxios";
import AddTodo from "./Add";
import Todo from "./Todo";
import { useCallback, useMemo, useState } from "react";
import { TodoUpdateElem } from "./TodoUpDateBtn";

const TodoList = (): JSX.Element => {
  //
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["get", "todo"],
    queryFn: getList,
  });

  const [checkedId, setCheckedID] = useState<number>();
  const [checkedComp, setCheckedComp] = useState<boolean>();

  const resetCheckAll = useCallback(() => {
    setCheckedID(undefined);
    setCheckedComp(undefined);
  }, [setCheckedComp, setCheckedID]);

  const todos: JSX.Element[] | undefined = useMemo(() => {
    return data?.map((item: ITodo) => (
      <Todo
        key={item.id}
        item={item}
        setCheckedId={setCheckedID}
        setCheckedComp={setCheckedComp}
        checkedId={checkedId}
      ></Todo>
    ));
  }, [data, setCheckedID, setCheckedComp, checkedId]);

  if (isLoading)
    return <div className="text-center text-blue-500">now Loading</div>;
  if (isError)
    return <div className="text-center text-red-500">{error.message}</div>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
      <AddTodo />
      <ul className="list-none space-y-2">{todos}</ul>
      <TodoUpdateElem
        tododata={{ id: checkedId, isCompleted: checkedComp }}
        resetCheckAll={resetCheckAll}
      />
    </div>
  );
};

export default TodoList;
