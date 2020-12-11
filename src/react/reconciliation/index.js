import { createTaskQueue } from "../Misc";

const taskQueue = createTaskQueue();

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
  /**
   * 任务是通过vNode构建fiber对象
   */
};
