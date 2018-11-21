
const { Client,Pool } = require('pg')

var clients;
var execPhp = require('exec-php');
var runner = require("child_process");

const makeQuery = (pool,query,result)=>{
  pool.connect()
  .then(client => {
    return client.query(query)
      .then(res => {

        client.release()
        //console.log(res)
        result.send({code:200,data:{rows:res.rows}})
      })
      .catch(e => {
        client.release()
        result.send({code:500,data:e.stack})
      })
  })
  .catch(e=>{

  })
}

exports.getConnections = (req,res)=> {
  if(clients.length===0){
    res.json({code:500,data:"No existen conexiones"})
  }
  else{
    let array = []
    clients.forEach(element => {
      let newElement= 
      { host:element.options.host,
        user:element.options.user,
        password:element.options.password,
        database:element.options.database,
        port:element.options.port
      }
      array.push(newElement)
    })
    res.json({code:200,data:array})
  }
  //res.send({code:500,data:"No existen conexiones"})
}

exports.connect = (req,res)=> {
  var newPool = new Pool(req.body["config"])
  //console.log(newPool)
  let available=true
  if(available===true){
    console.log("available")
    newPool.connect((err) => {
      if (err) {
        console.log(err)
        res.send({code:500,data:err})
      } else {
        client
        clients.push(newPool)
        res.send({code:200,data:{id:clients.length-1}})
      }
    })
  }
  else{
    console.log("no available")
    res.send({code:500,data:"coneccion existente"})
  }
}

exports.executeQuery = (req,res)=> {
  const query = req.body["query"]
  const pool = clients[req.body["id"]]
  console.log(req.body.id)
  makeQuery(pool,query,res)
}

exports.closeQueryConection = (req,res)=>{
  const id = req.params["id"]
  console.log(id)
  const client = clients.pop(req.body["id"])
  if(client){
  client.end()
  res.send({code:200,data:"Conexión cerrada con exito"})
  }else{
    res.send({code:500,data:"Cliente no encontrado"})
  }
}
exports.closeAllQueryConnections = (req,res)=>{

  for (let index = 0; index < clients.length; index++) {
    let client = clients.pop(0)
    client.end()
  }
  console.log("clients es: "+clients)
  res.send({code:200,data:"All Connections closed"})
}

exports.getTables = (req,res)=>{
  const query = 
  `Select table_name from INFORMATION_SCHEMA.tables where table_type = 'BASE TABLE' AND table_schema = '${req.params["schema"]}'` // query para obtener las tablas 
  const client = clients[req.params["id"]]
  if(client){
    makeQuery(client,query,res)
  }else{
    res.send({code:500,data:"Cliente no encontrado"})
  }
}

exports.getSchemas = (req,res)=>{
  const query = 
  `Select schema_name from INFORMATION_SCHEMA.Schemata` // query para obtener las tablas 
  const client = clients[req.params["id"]]
  if(client){
    makeQuery(client,query,res)
  }else{
    res.send({code:500,data:"Cliente no encontrado"})
  }
}

exports.getColumns = (req,res)=>{
  const query = 
  `Select column_name from information_schema.columns where table_schema = '${req.params["schema"]}' and table_name = '${req.params["table"]}'` // query para obtener las tablas 
  const client = clients[req.params["id"]]
  if(client){
    makeQuery(client,query,res)
  }else{
    res.send({code:500,data:"Cliente no encontrado"})
  }
}

exports.getTablePrivileges = (req,res)=>{
  const query = 
  `Select privilege_type from INFORMATION_SCHEMA.table_privileges where table_schema = '${req.params["schema"]}' AND table_name = '${req.params["table"]}'` // query para obtener las tablas 
  const client = clients[req.params["id"]]
  if(client){
    makeQuery(client,query,res)
  }else{
    res.send({code:500,data:"Cliente no encontrado"})
  }
}

exports.getColumnPrivileges = (req,res)=>{
  const query = 
  `SELECT privilege_type FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES where table_schema = '${req.params["schema"]}' and table_name = '${req.params["table"]}' and column_name = '${req.params["column"]}'` // query para obtener las tablas 
  const client = clients[req.params["id"]]
  if(client){
    makeQuery(client,query,res)
  }else{
    res.send({code:500,data:"Cliente no encontrado"})
  }
  
}

exports.getUsers = (req,res)=>{
  const query = 
  `SELECT * from users`
  const client = clients[req.params["id"]]
  if(client){
    makeQuery(client,query,res)
  }else{
    res.send({code:500,data:"Cliente no encontrado"})
  }
}
exports.prueba = (req,res)=>{
  var phpScriptPath = "../prueba.php";
  var argsString = "value1,value2,value3";
  runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
   if(err) console.log(err); /* log error */
  console.log( phpResponse );
  });
}





