const express = require('express');
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
let corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type – application/json
app.use(bodyParser.json());

// parse requests of content-type – application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));



//  connect db
const db = require("../App/models");
const Role = db.role;
db.sequelize.sync();

// add routes
require("../App/routes/auth.routes")(app);
require("../App/routes/user.routes")(app);



// set port listen for request
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Hallo server is running on ${PORT}.`);
});