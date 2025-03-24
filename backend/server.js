const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(bodyParser.json());

let tasks = [];


//ROTA CADASTRAR
app.post("/tasks", (req, res) => {
    const { nome, descricao, data, status } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ error: "Campos devem ser obrigatório" });
    }
    const novoTask = { id: uuidv4(), nome, descricao, data, status };
    tasks.push(novoTask);
    res.status(200).json(novoTask)

});

//CONSULTAR TASKS

app.get('/tasks', (req, res) => {
    res.json(tasks)
})


//ROTA ALTERAR
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { nome, descricao, data, status } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ error: "Campo deve ser obrigatório" });
    }
    const taskIndex = tasks.findIndex(item => item.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task não encotrado" });
    }
    tasks[taskIndex] = { id: taskId, nome, descricao, data, status };
    res.status(200).json(taskIndex)
});

//ROTA DE DELETAR

app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const arrayTask = tasks.length;
    tasks = tasks.filter(item => item.id !== taskId)

    if (tasks.length == arrayTask) {
        return res.status(404).json({ error: "Task não encontrado" });
    }
    res.status(204).send();

})

//EXECUTANDO O SERVIDOR 
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor Rodando na porta ${PORT} `);
})

