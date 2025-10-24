import mongoose from "mongoose";

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((error) => console.log(`${error} did not connect`));
};

export default connect;
