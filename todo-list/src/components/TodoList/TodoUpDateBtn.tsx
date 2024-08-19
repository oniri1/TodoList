import { ChangeEvent, useState } from "react";
import { Todo, updateTodo, deleteTodo } from "../../lib/todoAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IProps {
  tododata: Todo;
  resetCheckAll: () => void;
}

export const TodoUpdateElem = ({
  tododata: { id, isCompleted },
  resetCheckAll,
}: IProps): JSX.Element => {
  const [updateValue, setUpdateValue] = useState<string>("");
  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      await updateTodo({
        id: id,
        title: updateValue,
      });
    },
    onSuccess: async () => {
      resetCheckAll();
      await client.invalidateQueries({ queryKey: ["get", "todo"] });
    },
    onError: () => {
      console.log("에러 발생");
    },
  });

  return (
    <div className="mt-6">
      <input
        type="text"
        value={updateValue}
        data-testid={"inputUpdate"}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUpdateValue(e.target.value);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
        placeholder="새로 바꿀 내용을 지정해주세요"
      />
      <div className="flex space-x-2">
        <button
          onClick={() => {
            if (updateValue !== "") {
              mutate();
            }
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Update Todo
        </button>
        <button
          onClick={async () => {
            if (id) {
              await updateTodo({
                id: id,
                isCompleted: !isCompleted,
              });
              resetCheckAll();
              await client.invalidateQueries({ queryKey: ["get", "todo"] });
            }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Completed Change
        </button>
        <button
          onClick={async () => {
            if (id) {
              await deleteTodo({ id: id });
              resetCheckAll();
              await client.invalidateQueries({ queryKey: ["get", "todo"] });
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
