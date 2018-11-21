"use strict";
module.exports = function(app){

var controller = require("./controller");

app.get("/",(req,res)=>{res.send("Bienvenido al Servidor de la app")})

app.route("/executeQuery")
.post(controller.executeQuery)

app.route('/connect')
.post(controller.connect)

app.route("/closeConnection/:id")
.get(controller.closeQueryConection)

app.route("/getTables/:id/:schema")
.get(controller.getTables)

app.route("/getSchemas/:id")
.get(controller.getSchemas)

app.route("/getColumns/:id/:schema/:table")
.get(controller.getColumns)

app.route("/getTablePrivileges/:id/:schema/:table")
.get(controller.getTablePrivileges)

app.route("/getColumnPrivileges/:id/:schema/:table/:column")
.get(controller.getColumnPrivileges)

app.route("/getConnections")
.get(controller.getConnections)

app.route("/closeAllConnections")
.get(controller.closeAllQueryConnections)

app.route("/getUsers/:id")
.get(controller.getUsers)

app.route("/prueba")
.get(controller.prueba)
}


