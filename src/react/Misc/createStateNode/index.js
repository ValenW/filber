import { createDOMElement } from "../../DOM/mountElement";

export const createStateNode = (fiber) => {
  if (fiber.tag === "host_component") {
    return createDOMElement(fiber);
  }
};
