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
      const networkData =
        TodoContract.networks[`${process.env.REACT_APP_NETWORKID}`];
      if (networkData) {
        const Dtodo = new web3.eth.Contract(
          TodoContract.abi,
          process.env.REACT_APP_CONTRACT_ADDRESS
        );
        setTodo(Dtodo);
      } else {
        setError('Something went wrong with network ID');
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
      const data = await Todo.methods.addTodo(message).send({ from: account });
      console.log(data);
      const newTask = { message: message, isDone: false };
      setTodos((todos) => [...todos, newTask]);
      setMessage('');
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
      const value = e.target.checked;
      await Todo.methods
        .updateStatus(e.target.id, value)
        .send({ from: account });
      // setTodos(
      //   await todos.map((todo, idx) => {
      //     if (idx === Number(e.target.id)) {
      //       return { id: todo.id, isDone: value, message: todo.message };
      //     }
      //     return todo;
      //   })
      // );
    } catch (e) {
      console.log('update status error: ', e.message);
      setError(e.message);
    }
  };

  const removeTask = async (e) => {
    e.preventDefault();
    const id = Number(e.target.id.substr(1));
    try {
      await Todo.methods.deleteTodo(id).send({ from: account });
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
    <div className='container p-5' style={{ maxWidth: '530px' }}>
      <h4 className='text-danger'>{error}</h4>
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
      <button className='btn btn-outline-success mt-1' onClick={addTask}>
        Add
      </button>
      <div className='list-container pt-2'>
        <ul className='list-group' id='list'>
          {lodaing || todos == null ? (
            <Spinner />
          ) : (
            todos.map((todo, idx) => (
              <li
                key={idx}
                className='list-group-item d-flex justify-content-between mt-1'
              >
                <span className='strike-list'>{todo.message} </span>
                <input
                  onChange={statusUpdate}
                  className='form-check-input'
                  type='checkbox'
                  checked={todo.isDone}
                  id={idx}
                ></input>
                <button type='button' className='btn btn-outline-danger'>
                  <i
                    className='bi bi-trash-fill del'
                    id={`#${idx}`}
                    onClick={removeTask}
                  ></i>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
