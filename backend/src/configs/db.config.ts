import mongoose, { connect, ConnectOptions } from "mongoose";

// connect to mongoDB
mongoose.set("strictQuery", true);
const connectDB = () => {
  connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions).then(() => {
    console.log("mongoDB connected"), (error: any) => console.log(error);
  });
};

export default connectDB;
