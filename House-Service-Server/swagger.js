import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen();
const file = "./swagger-docs/swagger.json";
const endpoint = ["./app.js"];
const doc = {
  info: {
    title: "House Service API Documentation",
    version: "0.0.1",
  },
  host: "localhost:4000",
};

swagger(file, endpoint, doc).then(() => {
  import("./app.js");
});
