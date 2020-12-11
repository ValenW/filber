import { setDomAttribute } from "./elementProps";

export default function mountElement(vNode, container, oldDom) {
  // component's type is function
  if (typeof vNode.type === "function") {
    const type = vNode.type;
    let renderVNode = null;
    if (type.prototype && typeof type.prototype.render === "function") {
      const comp = new type(vNode.props);
      renderVNode = comp.render(vNode.props || {});
      renderVNode.componentInstance = comp;
    } else {
      renderVNode = type(vNode.props || {});
    }
    renderVNode.component = type;
    if (vNode.props && vNode.props.ref) {
      vNode.props.ref(renderVNode.componentInstance || type);
    }
    mountElement(renderVNode, container, oldDom);
  } else {
    const dom = createDOMElement(vNode);

    vNode.componentInstance && vNode.componentInstance.componentWillMount();
    oldDom ? container.replaceChild(dom, oldDom) : container.appendChild(dom);
    vNode.componentInstance && vNode.componentInstance.componentDidMount();
  }
}

export function createDOMElement(vNode) {
  let element = null;
  if (vNode.type === "text") {
    element = document.createTextNode(vNode.props.textContent);
  } else {
    element = document.createElement(vNode.type, vNode.props);
    setDomAttribute(element, vNode.props);
  }
  // vNode.children.forEach((child) => mountElement(child, element));
  // element._vNode = vNode;
  // if (vNode.componentInstance) {
  //   vNode.componentInstance.dom = element;
  // }
  // if (vNode.props && vNode.props.ref) {
  //   vNode.props.ref(element);
  // }
  return element;
}
