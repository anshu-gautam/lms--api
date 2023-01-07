import express from "express";
import cors from "cors";
import userRouter from "./app/routes/user";
import companyRouter from "./app/routes/company";
import orderRouter from "./app/routes/order";

import connectMongo from "./app/util/mongo";
import morgan from "morgan";

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :body"));

app.use(cors());
app.options("*", cors());

app.use(userRouter);
app.use(companyRouter);
app.use(orderRouter);

connectMongo();

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
