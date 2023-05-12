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

 //Mostrar todos os usuarios
 app.get("/users", async (req, res) => {
  const client = await pool.connect();

  try {
    const { rows } = await client.query("SELECT * FROM users");
    console.table(rows);
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro de conexão com o servidor");
  } finally {
    client.release();
  }
});

//Criar novo Usuario
app.post("/users", async (req, res) => {
  const client = await pool.connect();

  try {
    const { id, name, email, password } = req.body;

    if (!id || !name || !email || !password) {
      return res.status(401).send("Informe o id, nome, email e senha");
    }

    const existingUser = await client.query(
      `SELECT FROM users WHERE id=$1`,
      [id]
    );

    if (existingUser.rows.length > 0) {
      return res.status(401).send("Usuário já cadastrado");
    }

    await client.query(
      `INSERT INTO users (id, email, password, nome) VALUES ($1, $2, $3, $4)`,
      [id, email, password, name]
    );

    res.status(200).send({
      msg: "Usuario Cadastrado com sucesso",
      result: {
        id,
        email,
        password,
        name,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro de conexão com o servidor");
  } finally {
    client.release();
  }
});

//Alterar usuario por Id
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!id || !name) {
      return res.status(401).send("Campos obrigatorios vazios.");
    }

    const client = await pool.connect();
    const user = await client.query("SELECT * FROM users WHERE id=$1", [id]);
    if (user.rows.length === 0) {
      return res.status(401).send("Usuário não encontrado.");
    }

    await client.query(
      "UPDATE users SET nome=$1, email=$2, password=$3 WHERE id=$4",
      [name, email, password, id]
    );

    res.status(200).send({
      msg: "Usuário atualizado com sucesso.",
      result: {
        id,
        name,
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro de conexão com o servidor");
  }
});