import { useEffect, useState } from 'react';
import TodoContract from '../abis/Todo.json';
import Spinner from '../components/Spinner';

const Home = ({ web3, account }) => {
  const [Todo, setTodo] = useState(null);
  const [todos, setTodos] = useState(null);
  const [lodaing, setLodaing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const getTodoABI = async () => {
    try {
      /**
       * networkId and contract address after deploy
       */
      // const networkId = await web3.eth.net.getId();
      const networkData = TodoContract.networks['5777'];
      if (networkData) {
        const Dtodo = new web3.eth.Contract(
          TodoContract.abi,
          '0x29C80DD6362feEFAf98cE35bAadB4540Be0f1CD4'
        );
        setTodo(Dtodo);
      } else {
        window.alert('Decentragram contract not deployed to detected network.');
      }
    } catch (e) {
      console.log('somethig went wrong', e.message);
      setError(e.message);
    }
  };

  useEffect(() => {
    if (web3 !== '' && account !== '') {
      getTodoABI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, web3]);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await Todo.methods.addTodo(message).send({ from: account });
      const newTask = { message: message, isDone: false };
      setTodos((todos) => [...todos, newTask]);
    } catch (e) {
      console.log('error while adding new task', e.message);
      setError(e.message);
    }
  };

  const getAllTodos = async () => {
    try {
      const todos = await Todo.methods.getTodos().call();
      setTodos(todos);
    } catch (e) {
      console.log('getAllTods', e.message);
      setError(e.message);
    }
  };

  const statusUpdate = async (e) => {
    e.preventDefault();
    try {
      const value = !e.target.value;
      await Todo.methods
        .updateStatus(e.target.id, value)
        .send({ from: account });
      e.target.value = value;
    } catch (e) {
      console.log('update status error: ', e.message);
      setError(e.message);
    }
  };

  // const updateTask = () => {};
  const removeTask = async (e) => {
    e.preventDefault();
    const id = 0;
    try {
      await Todo.methods.deleteTodo(0).send({ from: account });
      setTodos(todos.filter((item, idx) => idx !== id));
    } catch (e) {
      console.log('removing task error: ', e.message);
      setError(e.message);
    }
  };

  useEffect(() => {
    if (Todo != null && todos == null) {
      setLodaing(true);
      getAllTodos();
      setLodaing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Todo, todos]);

  return (
    <div className='container p-5' style={{ maxWidth: '500px' }}>
      <h4>{error}</h4>
      <h2 className='text-center p-5'>Todo App</h2>
      <p className='tasks-desc'>
        Add tasks to your list by typing to the right and pressing enter.You may
        then view pending tasks below.
      </p>
      <div className='text-area'>
        <input
          type='text'
          id='input'
          className='form-control'
          placeholder='new item'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
      </div>
      <button className='btn btn-outline-success' onClick={addTask}>
        Add
      </button>
      <div className='list-container p-2'>
        <ul className='list-group list-group-flush' id='list'>
          {lodaing || todos == null ? (
            <Spinner />
          ) : (
            todos.map((todo, idx) => (
              <div key={idx} className='d-flex justify-content-between m-1'>
                <li className='list-group-item'>
                  <span className='strike-list'>{todo.message} </span>
                  <input
                    onChange={statusUpdate}
                    className='tick-mark checkbox-field'
                    type='checkbox'
                    id={idx}
                    checked={todo.isDone}
                    value={todo.isDone}
                  ></input>
                  {/* <button
                    onClick={updateTask}
                    className='btn btn-outline-success'
                  >
                    <i className='bi bi-pen edit'></i>
                  </button> */}
                  <button
                    type='button'
                    className='btn btn-outline-danger'
                    onClick={removeTask}
                  >
                    <i className='bi bi-trash-fill del'></i>
                  </button>
                </li>
              </div>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
