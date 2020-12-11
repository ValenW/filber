import { createDOMElement } from "../../DOM/mountElement";

export const createStateNode = (fiber) => {
  if (fiber.tag === "host_component") {
    return createDOMElement(fiber);
  } else if (fiber.tag === "class_component") {
    return new fiber.type(fiber.props);
  }
  return fiber.type;
};
