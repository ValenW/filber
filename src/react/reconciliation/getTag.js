import { Component } from "..";

export const getTag = (type) => {
  if (typeof type === "string") {
    return "host_component";
  } else if (Component.isPrototypeOf(type)) {
    return "class_component";
  }
  return "function_component";
};
