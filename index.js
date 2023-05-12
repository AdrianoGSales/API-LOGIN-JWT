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

//CHAMADA LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const client = await pool.connect();

  try {
    const findUser = await client.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );

    if (findUser.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não existe' });
    }

    if (findUser.rows[0].password !== password) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, name } = findUser.rows[0];

    const token = jwt.sign({ id }, process.env.SECRET_JWT, {
      expiresIn: process.env.EXPIRESIN_JWT,
    });

    return res.status(200).json({
      user: {
        id,
        name,
        email,
      },
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro de conexão com o servidor");
  } finally {
    client.release();
  }
});