import React, { render, Component } from "./react";

const root = document.getElementById("root");

class ClassComponent extends Component {
  render() {
    return <div>Hello Class</div>;
  }
}

class ClassComponent2 extends ClassComponent {
  render() {
    return <div>Hello Component2</div>;
  }
}

const FunctionComponent = () => <div>Hello Function Component</div>;

const jsx = (
  <div>
    <p>Hello Fiber</p>
    <p>
      <h1>Hi</h1>
      <h2>Fiber</h2>
    </p>
    <ClassComponent />
    <ClassComponent2 />
    <FunctionComponent />
  </div>
);

render(jsx, root);
