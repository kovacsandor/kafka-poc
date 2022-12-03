import { app } from "./app";

const port = 8080;
app.listen(port, async () => {  
  console.log(`Microservice "A" listening on port ${port}...`);
});
