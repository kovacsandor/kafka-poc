import { Kafka, KafkaMessage } from "kafkajs";
import {
  testObjectModel,
  TestObjectDocument,
  KafkaOffset,
} from "./testObjectModel";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "microservice-b-client",
});

const getLastOffset = async (): Promise<number | undefined> => {
  const [result] = await testObjectModel.aggregate<KafkaOffset>([
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $project: {
        _id: 0,
        _kafkaOffset: 1,
      },
    },
    {
      $limit: 1,
    },
  ]);

  return result?._kafkaOffset;
};

const saveDocument = async (
  message: KafkaMessage
): Promise<TestObjectDocument> => {

  // Saving the document can take a long time...
  const simulateLongProcessTime = () => {
    return Math.round(Math.random() * 1000);
  };

  const promise = new Promise<TestObjectDocument>(async (resolve, reject) => {
    setTimeout(async () => {
      // Sometimes an error occurs during saving the document...
      if (Math.random() < 0.2) {
        reject(new Error("An unexpected error has occurred"));
      } else {
        const result = await testObjectModel
          .createDocument({
            _kafkaOffset: Number(message.offset),
            name: message.value?.toString() || "",
          })
          .save();
        resolve(result);
      }
    }, simulateLongProcessTime());
  });

  return promise;
};

export const subscribeKafka = async (topics: string[]) => {
  const consumer = kafka.consumer({ groupId: "microservice-b-group" });
  await consumer.connect();
  await Promise.all(
    topics.map((topic) => consumer.subscribe({ topic, fromBeginning: true }))
  );

  await consumer.run({
    eachMessage: async ({ message, partition, topic }) => {
      switch (topic) {
        case "test-topic-1":
          console.log("Message received", {
            key: message.key?.toString(),
            offset: message.offset.toString(),
            timestamp: message.timestamp.toString(),
            value: message.value?.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });
          const lastOffset = await getLastOffset();
          if (
            lastOffset === undefined ||
            lastOffset + 1 === Number(message.offset)
          ) {
            await saveDocument(message);
            console.log("Message processed", {
              key: message.key?.toString(),
              offset: message.offset.toString(),
              timestamp: message.timestamp.toString(),
              value: message.value?.toString(),
              partition: partition.toString(),
              topic: topic.toString(),
            });
          }

          // Sometimes the process may exits for any reason
          if (Math.random() < 0.01) {
            console.log("Process exited...");
            process.exit(1);
          }

          break;
        default:
          throw new Error("Invalid case");
      }
    },
  });
};
