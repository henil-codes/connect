import { CourierClient } from "@trycourier/courier";

const authorizationToken = process.env.AUTH_TOKEN;
const courier = CourierClient({ authorizationToken: authorizationToken });

const { requestId } = await courier.send({
  message: {
    to: {
      email: "code80147@gmail.com",
    },
    template: "GCQ5HSY8KRM46SHQACVA56ZQSGDY",
    data: {
    },
  },
});

export default requestId;