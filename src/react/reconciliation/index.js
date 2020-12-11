import { createTaskQueue } from "../Misc";
import { createStateNode } from "../Misc/createStateNode";
import { getTag } from "./getTag";

const taskQueue = createTaskQueue();
let task = null;

/**
 * fiber 将树状结构序列化为顺序结构, 非首个child挂载到前一个兄弟节点上
 * Fiber对象
 * {
 *   tag          节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)
 *   type         节点类型 (元素, 文本, 组件)(具体的类型)
 *   props        节点属性
 *   stateNode    节点 DOM 对象 | 组件实例对象
 *
 *   effects      数组, 存储需要更改的 fiber 对象
 *   effectTag    当前 Fiber 要被执行的操作 (新增, 删除, 修改)
 *
 *   parent       当前 Fiber 的父级 Fiber
 *   child        当前 Fiber 的子级 Fiber
 *   sibling      当前 Fiber 的下一个兄弟 Fiber
 *
 *   alternate    Fiber 备份 fiber 比对时使用
 * }
 */

// 创建下一个大任务的根节点fiber
const buildRootFiber = () => {
  const task = taskQueue.pop();
  return task
    ? {
        type: undefined,
        props: task.props,
        stateNode: task.dom,
        tag: "host_root",
        effects: [],
        child: null,
      }
    : null;
};

const reconcileChildren = (fiber, children) => {
  children = Array.isArray(children) ? children : [children];

  let prevFiber = null;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const newFiber = {
      tag: getTag(child.type),
      type: child.type,
      props: child.props,
      effects: [],
      effectTag: "placement",
      parent: fiber,
    };
    newFiber.stateNode = createStateNode(newFiber);

    if (i === 0) {
      fiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }
    prevFiber = newFiber;
  }
  console.log(prevFiber);
};

const executeTask = (fiber) => {
  reconcileChildren(fiber, fiber.props.children);
};

// 更新并循环执行任务
const workLoop = (deadline) => {
  if (!task) {
    task = buildRootFiber();
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
    props: { children: vNode },
  });

  requestIdleCallback(performTask);

  /**
   * 任务是通过vNode构建fiber对象
   */
};
