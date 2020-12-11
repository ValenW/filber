export const getFirstHostAncestor = (fiber) => {
  let ancestor = fiber.parent;
  while (
    ancestor &&
    (ancestor.tag === "class_component" ||
      ancestor.tag === "function_component")
  ) {
    ancestor = ancestor.parent;
  }
  return ancestor;
};
