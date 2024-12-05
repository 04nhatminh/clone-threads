const bcrypt = require("bcryptjs");

const bcryptUtils = {
  hashPassword: async (password) => {
    return await bcrypt.hash(password, 10);
  },
  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = bcryptUtils;
