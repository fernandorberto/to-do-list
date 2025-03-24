// Importa hooks e bibliotecas necessárias
import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const Tasks = () => {
  // Define a URL base da API de tasks
  const API_URL = 'http://localhost:5000/tasks';

  // Estado com a lista de tasks cadastradas
  const [tasks, setTasks] = useState([]);

  // Estado da task que está sendo criada ou editada
  const [novatask, setNovaTask] = useState({
    nome: '',
    descricao: '',
    data: '',
    status: ''
  });

  // Estado que indica se estamos editando uma task
  const [editar, setEditar] = useState(false);

  // Ao carregar o componente, busca todas as tasks da API
  useEffect(() => {
    fetchTasks();
  }, []);

  // Função que busca as tasks no backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log('Tasks recebidas:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.log('Erro ao buscar Tasks', error);
    }
  };

  // Estado que guarda o valor digitado no campo de busca
  const [filtro, setFiltro] = useState('');

  // Função que cadastra uma nova task na API
  const cadastrarTask = async () => {
    if (!novatask.nome || !novatask.descricao) {
      alert('campo Obrigatório');
      return;
    }
    try {
      const reponse = await axios.post(API_URL, novatask);
      setTasks([...tasks, reponse.data]);
      setNovaTask({ nome: '', descricao: '', data: '', status: '' });
      console.log('Task a ser enviada:', novatask);
      setEditar(false);
    } catch (error) {
      console.log('Erro ao cadastrar Task', error);
    }
  };

  // Função que altera uma task existente
  const alterarTask = async () => {
    if (!novatask.nome || !novatask.descricao) {
      alert('campo Obrigatório');
      return;
    }
    try {
      await axios.put(`${API_URL}/${novatask.id}`, novatask);
      confirm(`Deseja mesmo alterar o task ${novatask.nome}?`);
      setTasks(tasks.map(task => (task.id === novatask.id ? novatask : task)));
      setNovaTask({ nome: '', descricao: '', data: '', id: '', status: '' });
      setEditar(false);
    } catch (error) {
      console.log('Erro ao Alterar Task', error);
    }
  };

  // Função que exclui uma task
  const apagarTask = async id => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      confirm('Deseja mesmo apagar?');
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.log('Erro ao excluir task', error);
    }
  };

  // Função que trata o envio do formulário
  const handleSubmit = e => {
    e.preventDefault();
    if (editar) {
      alterarTask();
    } else {
      cadastrarTask();
    }
  };

  // Quando clica em editar, carrega a task no formulário
  const handleEditar = task => {
    setNovaTask(task);
    setEditar(true);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-4 flex justify-center text-blue-900">
        To Do List
      </h1>

      {/* Formulário de criação/edição */}
      <form className="mb-4">
        {/* Campo Nome */}
        <div className="mb-2">
          <label htmlFor="nome" className="block text-sm font-bold text-blue-900">Nome</label>
          <input
            type="text"
            id="nome"
            placeholder="Nome da task"
            value={novatask.nome}
            onChange={e => setNovaTask({ ...novatask, nome: e.target.value })}
            className="mt-1 p-2 border rounded-2xl w-full"
          />
        </div>

        {/* Campo Descrição */}
        <div className="mb-2">
          <label htmlFor="descricao" className="block text-sm font-bold text-blue-900">Descrição</label>
          <input
            type="text"
            id="descricao"
            placeholder="Descrição da task"
            value={novatask.descricao}
            onChange={e => setNovaTask({ ...novatask, descricao: e.target.value })}
            className="mt-1 p-2 border rounded-2xl w-full"
          />
        </div>

        {/* Campo Data */}
        <div className="mb-2">
          <label htmlFor="data" className="block text-sm font-bold text-blue-900">Data Prevista</label>
          <DatePicker
            selected={novatask.data ? new Date(novatask.data) : null}
            onChange={data => setNovaTask({ ...novatask, data: data.toISOString() })}
            placeholderText="Selecione a data"
            dateFormat="dd/MM/yyyy"
            className="mt-1 p-2 border rounded-2xl w-full"
          />
        </div>

        {/* Campo Status */}
        <div className="mb-2">
          <label htmlFor="status" className="block text-sm font-bold text-blue-900">Status</label>
          <select
            id="status"
            value={novatask.status}
            onChange={e => setNovaTask({ ...novatask, status: e.target.value })}
            className="mt-1 p-2 border rounded-2xl w-full"
          >
            <option value="">Selecione o status</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Pendente">Pendente</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Backlog">Backlog</option>
          </select>
        </div>

        {/* Botão de envio */}
        <button
          onClick={handleSubmit}
          className="bg-amber-500 hover:bg-amber-300 text-black font-extrabold py-2 px-4"
        >
          {editar ? 'Alterar' : 'Cadastrar'}
        </button>
      </form>

      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Buscar task por nome..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-2xl w-full"
      />

      {/* Cabeçalho da lista */}
      <div className="mb-2 grid grid-cols-5 font-bold text-blue-900">
        <span className="text-left">Task</span>
        <span className="text-left">Descrição</span>
        <span className="text-left">Data</span>
        <span className="text-left">Status</span>
        <span className="text-center">Ações</span>
      </div>

      {/* Lista de tasks */}
      <ul>
        {tasks
          .filter(task => task.nome.toLowerCase().includes(filtro.toLowerCase()))
          .map(task => {
            const dataTask = new Date(task.data);
            const hoje = new Date();
            dataTask.setHours(0, 0, 0, 0);
            hoje.setHours(0, 0, 0, 0);
            const vencida = dataTask < hoje;

            return (
              <li
                key={task.id}
                className={`border p-2 mb-2 rounded-2xl grid grid-cols-5 items-center ${
                  task.id === novatask.id ? 'bg-yellow-100' : ''
                }`}
              >
                <span className="text-left">{task.nome}</span>
                <span className="text-left">{task.descricao}</span>
                <span className={`text-left ${vencida ? 'text-orange-500' : 'text-green-600'}`}>
                  {task.data && format(new Date(task.data), 'dd/MM/yyyy')}
                </span>
                <span
                  className={`
                    text-left font-semibold 
                    ${task.status === 'Finalizado' ? 'text-green-600' : 
                      task.status === 'Parado' || task.status === 'Pendente' ? 'text-red-500' : 
                      'text-yellow-500'}
                  `}
                >
                  {task.status === 'Finalizado' && '✔️ '}
                  {task.status === 'Parado' || task.status === 'Pendente' ? '⏸️ ' : ''}
                  {task.status === 'Em andamento' || task.status === 'Backlog' ? '🔄 ' : ''}
                  {task.status}
                </span>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEditar(task)}
                    className="bg-blue-600 hover:bg-blue-300 text-black font-bold py-1 px-3 rounded-2xl"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => apagarTask(task.id)}
                    className="bg-red-600 hover:bg-red-300 text-black font-bold py-1 px-3 rounded-2xl"
                  >
                    Apagar
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Tasks;
