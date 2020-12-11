import express from "express";

const app = express();

const template = `
  <html>
    <head>
      <title>React Fiber</title>
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>
`;

app.get("*", (req, res) => {
  res.send(template);
});

app.listen(3000, () => console.log("running on 3000..."));
