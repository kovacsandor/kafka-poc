import express, { Request, Response,  } from "express";
import { sendMessages } from "./kafka";

export const app = express();

app.post(
  "/microservice-a/test-kafka-producer/test-topic-1/:message",
  async (req: Request, res: Response) => {
    console.log(
      "microservice-a POST /microservice-a/test-kafka-producer/test-topic-1/:message called..."
    );

    const message = req.params.message;

    const recordMetadata = await sendMessages('test-topic-1', [message])
    res.status(200);
    res.send(recordMetadata);
  }
);
