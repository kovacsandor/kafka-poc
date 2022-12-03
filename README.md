# Kafka POC

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

Call `POST microservice-a/test-kafka-producer/test-topic-1/:message` with Postman several times with different messages.

Sometimes Microservice B will fail and throw an error. But eventually all the sent messages will be saved to the database in the correct order.

This is because the order of the messages is guaranteed within a topic:partition and only one consumer can listen to one partition.
