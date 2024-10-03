import TasksByStatus from "./TasksByStatus";

const TasksByStatusInProgress = () => {
  return <TasksByStatus status="in progress" />;
};

const TasksByStatusToDo = () => {
  return <TasksByStatus status="to-do" />;
};

const TasksByStatusBlocked = () => {
    return <TasksByStatus status="blocked" />;
  };



export { TasksByStatusInProgress, TasksByStatusToDo, TasksByStatusBlocked};
