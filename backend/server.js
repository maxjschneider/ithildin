"use strict";

const fastify = require("fastify")();

fastify.get("/", async (request, reply) => {
  return { message: "Hello world!" };
});

fastify.listen(
  { host: process.env.ADDRESS, port: parseInt(process.env.PORT, 10) },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
