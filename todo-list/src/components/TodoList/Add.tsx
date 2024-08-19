import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useState } from "react";
import { addTodo } from "../../lib/todoAxios";

const AddTodo = (): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>("");
  const client = useQueryClient();

  const onChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setInputValue(value);
    },
    []
  );

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      const todo = await addTodo({ title: inputValue });
      return todo;
    },
    onSuccess: () => {
      setInputValue("");
      client.invalidateQueries({ queryKey: ["get", "todo"] });
    },
    onError: () => {
      console.log("에러 발생");
    },
  });

  if (isPending) return <div>now Pending</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="flex space-x-2 mb-4">
      <input
        type="text"
        data-testid={"inputFirst"}
        value={inputValue}
        className="flex-1 px-3 py-2 border border-gray-300 rounded"
        onChange={onChange}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => {
          mutate();
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

export default AddTodo;
