import React, { render } from "./react";

const root = document.getElementById("root");
const jsx = (
  <div>
    <p>Hello Fiber</p>
    <p>
      <h1>Hi</h1>
      <h2>Fiber</h2>
    </p>
  </div>
);

render(jsx, root);

console.log(jsx);
