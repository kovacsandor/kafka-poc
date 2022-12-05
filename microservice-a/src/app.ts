import express, { Request, Response,  } from "express";
import { sendMessages } from "./kafka";

export const app = express();

app.post(
  "/microservice-a/test-kafka-producer/test-topic-1",
  async (req: Request, res: Response) => {
    console.log(
      "microservice-a POST /microservice-a/test-kafka-producer/test-topic-1 called..."
    );

    for (let index = 0; index < 100; index++) {
      setTimeout(async () => {
        await sendMessages('test-topic-1', [`test-name-${index}`])
        console.log('Message sent', index);
        
      }, index * 50);;
      
    }
    res.status(200);
    res.send('Messages sent');
  }
);
