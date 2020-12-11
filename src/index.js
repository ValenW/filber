import React, { render, Component } from "./react";

const root = document.getElementById("root");

class ClassComponent extends Component {
  render() {
    return (
      <div>
        Hello Class<div>{this.props.title}</div>
      </div>
    );
  }
}

class ClassComponent2 extends ClassComponent {
  render() {
    return (
      <div>
        Hello Component2 <div>{this.props.title}</div>
      </div>
    );
  }
}

const FunctionComponent = (props) => (
  <div>
    Hello Function Component<div>{props.title}</div>
  </div>
);

const jsx = (
  <div>
    <p>Hello Fiber</p>
    <p>
      <h1>Hi</h1>
      <h2>Fiber</h2>
    </p>
    <ClassComponent title={"old"} />
    <ClassComponent2 title={"old"} />
    <FunctionComponent title={"old"} />
  </div>
);

const updatedJsx = (
  <div>
    <p>Hello update Fiber</p>
    <p>
      <h1>Hi update</h1>
      <h2>Fiber</h2>
    </p>
    <ClassComponent title="new" />
    <ClassComponent2 title="new" />
    <FunctionComponent title="new" />
  </div>
);

render(jsx, root);

setTimeout(() => {
  render(updatedJsx, root);
}, 2000);
