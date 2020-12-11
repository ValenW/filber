import { createTaskQueue } from "../Misc";
import { createStateNode } from "../Misc/createStateNode";
import { getFirstHostAncestor } from "../Misc/getFirstHostAncestor";
import { getTag } from "./getTag";
import { updateDomAttribute } from "../DOM/elementProps";

const taskQueue = createTaskQueue();
let task = null;
let paddingCommit = null;

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
        alternate: task.dom.__rootFiberContainer,
      }
    : null;
};

const reconcileChildren = (fiber, children) => {
  children = Array.isArray(children) ? children : [children];

  let alternate = (fiber.alternate && fiber.alternate.child) || null;
  let prevFiber = null;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const newFiber = {
      tag: getTag(child.type),
      type: child.type,
      props: child.props,
      effects: [],
      effectTag: alternate ? "update" : "placement",
      parent: fiber,
      alternate,
    };

    if (alternate && alternate.type === newFiber.type) {
      newFiber.stateNode = alternate.stateNode;
    } else {
      newFiber.stateNode = createStateNode(newFiber);
    }

    if (i === 0) {
      fiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }

    alternate = (alternate && alternate.sibling) || null;
    prevFiber = newFiber;
  }
  while (alternate) {
    alternate.effectTag = "delete";
    fiber.effects.push(alternate);
    alternate = alternate.sibling;
  }
};

const commitAllWork = (fiber) => {
  console.log(fiber);

  fiber.effects.forEach((fiber) => {
    if (fiber.tag !== "host_component") {
      return;
    }

    const ancestor = getFirstHostAncestor(fiber);
    const alternate = fiber.alternate;
    switch (fiber.effectTag) {
      case "placement":
        ancestor.stateNode.appendChild(fiber.stateNode);
        break;
      case "update":
        // 子节点是update, 父节点必然是update
        if (fiber.type !== alternate.type) {
          ancestor.stateNode.replaceChild(fiber.stateNode, alternate.stateNode);
        } else if (fiber.type !== "text") {
          updateDomAttribute(alternate.stateNode, fiber, alternate);
        } else if (fiber.props.textContent !== alternate.props.textContent) {
          alternate.stateNode.textContent = fiber.props.textContent;
        }
        break;
      case "delete":
        fiber.stateNode.remove();
        break;
      default:
        break;
    }
  });

  // 备份fiber用于更新时对比
  fiber.stateNode.__rootFiberContainer = fiber;
};

const executeTask = (fiber) => {
  if (fiber.tag === "class_component") {
    reconcileChildren(fiber, fiber.stateNode.render());
  } else if (fiber.tag === "function_component") {
    reconcileChildren(fiber, fiber.stateNode(fiber.props));
  } else {
    reconcileChildren(fiber, fiber.props.children);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let current = fiber;
  while (current.parent) {
    current.parent.effects = current.parent.effects.concat(
      ...current.effects,
      current
    );
    if (current.sibling) {
      return current.sibling;
    }
    current = current.parent;
  }

  // all fibers is created if arrive here
  paddingCommit = current;
  return null;
};

// 更新并循环执行任务
const workLoop = (deadline) => {
  if (!task) {
    task = buildRootFiber();
  }
  while (task && deadline.timeRemaining() > 1) {
    task = executeTask(task);
  }
  if (paddingCommit) {
    commitAllWork(paddingCommit);
    paddingCommit = null;
  }
};

const performTask = (deadline) => {
  workLoop(deadline);
  if (task || !taskQueue.isEmpty()) {
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
