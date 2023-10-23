import app from "./app";
import mongoose from "mongoose";

import config from "./config/index";

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URL);
    console.log("DB CONNECTED...");

    // express events
    app.on("error", (err) => {
      console.log("ERROR: ", err);
      throw err;
    });

    app.listen(config.PORT, () =>
      console.log(`App is running at port ${config.PORT}`)
    );
  } catch (error) {
    console.log(`ERROR`, error);
    throw error;
  }
})();
