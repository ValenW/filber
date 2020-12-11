const PropNames = Object.freeze(["value", "checked"]);

export function setDomAttribute(element, props) {
  Object.keys(props).forEach((p) => {
    const value = props[p];
    const eventName = getEventName(p);
    if (eventName) {
      element.addEventListener(eventName, value);
    } else if (PropNames.includes(p)) {
      element[p] = value;
    } else if (p !== "children") {
      element.setAttribute(p === "className" ? "class" : p, value);
    }
  });
}

export function updateDomAttribute(dom, { props }, { props: oldProps }) {
  setDomAttribute(dom, props);
  Object.keys(oldProps).forEach((p) => {
    const oldValue = oldProps[p];
    const eventName = getEventName(p);
    if (eventName) {
      dom.removeEventListener(eventName, oldValue);
    } else if (typeof props[p] === "undefined") {
      dom.removeAttribute(p);
    }
  });
}

export function getEventName(propName) {
  if (propName.startsWith("on")) {
    return propName.slice(2).replace(/^\S/g, (c) => c.toLowerCase());
  }
  return false;
}
