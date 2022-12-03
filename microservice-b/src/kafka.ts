import { Kafka, KafkaMessage } from "kafkajs";
import { testObjectModel } from "./testObjectModel";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "microservice-b-client",
});

export const subscribeKafka = async (topics: string[]) => {
  const consumer = kafka.consumer({ groupId: "microservice-b-group" });
  await consumer.connect();
  await Promise.all(
    topics.map((topic) => consumer.subscribe({ topic, fromBeginning: true }))
  );

  await consumer.run({
    eachMessage: async ({ message, partition, topic }) => {
      const createDocument = async (message: KafkaMessage): Promise<void> => {
        await testObjectModel
          .createDocument({
            name: message.value?.toString() || "",
          })
          .save();
      };

      const simulateFailure = () => {
        if (Math.random() < 0.5) {
          throw new Error("An error has occurred");
        }
      };
      switch (topic) {
        case "test-topic-1":
          console.log("Received message", {
            messageValue: message.value?.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });
          simulateFailure();
          await createDocument(message);
          console.log("test-topic-1 processed", {
            messageValue: message.value?.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });
          break;
        default:
          throw new Error("Invalid case");
      }
    },
  });
};
