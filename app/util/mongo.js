import mongoose from "mongoose";

 function connectMongo() {
  mongoose.connect("mongodb://localhost:27017/laundryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log("Connected to MongoDB"));
}
export default connectMongo;