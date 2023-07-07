const userSchema = require("../models/userSchema");

class AuthenticationRepo {
  constructor() {
    this.userSchema = userSchema;
  }

  async createUser(userDetails) {
    await this.userSchema.create(userDetails);
  }

  async findUser(filter) {
    return await this.userSchema.find(filter).lean();
  }
}

module.exports = AuthenticationRepo;
