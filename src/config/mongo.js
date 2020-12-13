const { MongoClient } = require('mongodb');

const { mongo } = appRequire("config");
const logger = appRequire("config", "logger");

class MongoConnect {
  constructor() {
    this.client = new MongoClient(mongo.uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    this.db = null;
  }

  async init() {
    try {
      if (!this.db) {
        await this.client.connect();
        console.log("MongoDB Connected");
    
        this.db = this.client.db(mongo.dbName);
      }
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = MongoConnect;