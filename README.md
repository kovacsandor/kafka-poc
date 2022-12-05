# Kafka POC

## Handles the following occurrences

- saving to the database takes varying period of time
- sometimes the data can't be saved
- sometimes the process exited just after saving the data but before the consumer commits the message offset

## How to test

Start up Kafka and the database

```bash
cd ~/Projects/kafka-poc/
docker-compose up
```

In separate terminal windows start microservice A...

```bash
cd ~/Projects/kafka-poc/microservice-a
npm i
npm run dev
# runs on port 8080
```

... and 2 instances of microservice B.

```bash
cd ~/Projects/kafka-poc/microservice-b
npm i
npm run dev 8081
```

```bash
cd ~/Projects/kafka-poc/microservice-b
npm i
npm run dev 8082
```

Call `POST microservice-a/test-kafka-producer/test-topic-1/` with Postman, it will send 100 messages.

Sometimes Microservice B will fail and throw an error. But eventually all the sent messages will be saved to the database in the correct order.

This is because the order of the messages is guaranteed within a topic:partition and only one consumer can listen to one partition.

Sometimes the process will exit. Maybe because of a failure or because updating the microservice. In this test you can restart the process by hand.

Because Microservice B saves the message offset to the database it can determine if the message needs to be processed or not.

## Expected result

If you connect to the database `mongodb://localhost:27017/microservice-b` you should find 100 records, all in order.

No. | _id ObjectId | _kafkaOffset Int32 | name String | __v Int32
--- | --- | --- | --- | ---
1 | 638e5c4429e7d049d708e40b | 0 | "test-name-0" | 0
2 | 638e5c4429e7d049d708e40e | 1 | "test-name-1" | 0
... | ... | ... | ... | ...
3 | 638e5c4429e7d049d708e411 | 99 | "test-name-99" | 0
