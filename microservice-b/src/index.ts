import express from "express";
import { connect } from "mongoose";
import { subscribeKafka } from "./kafka";

const app = express();
const port = process.argv[2];

app.listen(port, async () => {  
  await connect(
    "mongodb://localhost:27017/microservice-b"
  );

  await subscribeKafka(['test-topic-1', 'test-topic-2'])
  console.log(`Microservice "B" listening on port ${port}...`)
});
