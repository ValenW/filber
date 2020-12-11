export const getTag = (type) => {
  return typeof type === "string" ? "host_component" : "";
};
