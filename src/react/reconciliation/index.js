import { createTaskQueue } from "../Misc";

const taskQueue = createTaskQueue();
let task = null;

const executeTask = (task) => {};

// 更新并循环执行任务
const workLoop = (deadline) => {
  if (!task) {
    task = taskQueue.pop();
  }
  while (task && deadline.timeRemaining() > 1) {
    task = executeTask(task);
  }
};

const performTask = (deadline) => {
  workLoop(deadline);
  if (!task || !taskQueue.isEmpty()) {
    requestIdleCallback(performTask);
  }
};

export const render = (vNode, container) => {
  console.log(vNode, container);
  /**
   * 1. 向任务队列添加任务
   * 2. 指定浏览器空闲时执行任务
   */
  taskQueue.push({
    dom: container,
    props: { children: vNode.props },
  });

  requestIdleCallback(performTask);

  /**
   * 任务是通过vNode构建fiber对象
   */
};
