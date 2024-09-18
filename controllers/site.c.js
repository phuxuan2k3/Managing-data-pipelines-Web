require("dotenv").config();
const ENV = process.env;

module.exports = {
  getIndex: (req, res) => {
    res.render("index");
    return;
  },
};
