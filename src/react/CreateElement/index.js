export default function createElement(type, props, ...childrenNode) {
  const getNode = (node) => {
    if (node !== false && node !== true && node !== null) {
      if (node instanceof Array) {
        return node.flatMap(getNode).filter((node) => node !== null);
      } else if (node instanceof Object) {
        return [node];
      }
      return [createElement("text", { textContent: node })];
    }
    return null;
  };

  const children = childrenNode.reduce((acc, cur) => {
    const node = getNode(cur);
    node && acc.push(...node);
    return acc;
  }, []);
  return {
    type,
    props: { children, ...props },
  };
}
