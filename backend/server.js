"use strict";

const fastify = require("fastify")();
const jwt = require("@fastify/jwt");

fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "token",
    signed: false,
  },
});

fastify.register(require("@fastify/cookie"));
fastify.register(require("@fastify/cors"), {
  origin: process.env.DOMAIN,
  credentials: true,
});

fastify.get("/cookies", async (request, reply) => {
  const token = await reply.jwtSign({
    name: "foo",
  });

  reply
    .setCookie("token", token, {
      domain: undefined,
      path: "/",
      secure: process.env.DEV === 1 ? true : false, // send cookie over HTTPS only
      httpOnly: true,
      sameSite: true, // alternative CSRF protection
    })
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({ message: "Cookie sent" });
});

fastify.addHook("onRequest", (request, reply, done) => {
  console.log(request.cookies);

  done();
});

fastify.get("/verify", async (request, reply) => {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({ message: "hello world" });
});

fastify.listen(
  { host: process.env.ADDRESS, port: parseInt(process.env.PORT, 10) },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(
      `Server listening at ${process.env.ADDRESS + ":" + process.env.PORT}`
    );
  }
);
