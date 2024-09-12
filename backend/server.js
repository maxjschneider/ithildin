"use strict";

const fastify = require("fastify")();

fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET
})

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
    console.log(`Server listening at ${address + ":" + port}`);
  }
);
