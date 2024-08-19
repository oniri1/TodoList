import { Todo as ITodo } from "../../lib/todoAxios";

import { ChangeEvent } from "react";

interface IProps {
  item: ITodo;
  setCheckedId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCheckedComp: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  checkedId: number | undefined;
}

const Todo = ({
  item,
  setCheckedId,
  setCheckedComp,
  checkedId,
}: IProps): JSX.Element => {
  if (!item.id) return <li className="text-center text-red-500">id Err</li>;

  return (
    <li className="flex items-center justify-between p-2 border-b border-gray-300">
      <div className="flex items-center space-x-2">
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setCheckedId(item.id);
            setCheckedComp(item.isCompleted);
          }}
          name="todoBox"
          data-testid="todobox"
          className="todoBox accent-blue-500"
          type="checkbox"
          value={item.title}
          checked={item.id === checkedId}
        />
        <span
          className={`flex-1 ${
            item.isCompleted ? "line-through text-gray-500" : ""
          }`}
        >
          {item.title}
        </span>
      </div>
      <span
        className={`text-sm ${
          item.isCompleted ? "text-green-500" : "text-red-500"
        }`}
      >
        {item.isCompleted ? "완료" : "진행중"}
      </span>
    </li>
  );
};

export default Todo;
