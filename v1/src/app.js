const config = require("./config");
const express = require("express");
const helmet = require("helmet");
const loaders = require("./loaders");
const {ProjectRoutes, UserRoutes} = require("./api-routes")
const uuid = require("uuid");


config();
loaders();

const app = express();
app.use(express.json())
app.use(helmet())


app.listen(process.env.APP_PORT , () => {
    app.use("/projects", ProjectRoutes )
    app.use("/users",UserRoutes)
})
