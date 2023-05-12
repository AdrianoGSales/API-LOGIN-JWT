/*Criar uma API de login com jwt que conecte ao banco postgree/*/

/*Rotas:
app.get ("/") -> Homepage
App.post("/Login") -> chamada login
app.get("/Users") -> Mostrar todos os usuarios
app.post("/Users") -> Criar um novo usuario
app.put ("/Users/:id") -> Alterar um usuario por ID
app.delete ("/Users/:id") -> Deletar um usuaro por ID
/*/


const express = require("express");
const { pool } = require("./data/data");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

app.listen(8080, ()=>{
    console.log ("O servidor esta  ativo na porta 8080")
});

//HOMEPAGE
app.get("/", (req, res) =>{ /*/ homepage /*/
    res.send (`Seja Bem vindo!!!`)
});

