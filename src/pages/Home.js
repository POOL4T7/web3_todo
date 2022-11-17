import { useEffect, useState } from 'react';
import TodoContract from '../abis/Todo.json';

const Home = ({ web3, account }) => {
  const [Todo, setTodo] = useState(null);
  const [todos, setTodos] = useState(null);
  const [lodaing, setLodaing] = useState(false);

  const getTodoABI = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const networkData = TodoContract.networks[networkId];
      if (networkData) {
        const Dtodo = new web3.eth.Contract(
          TodoContract.abi,
          '0x7052B8Ec9860954922CfA712A205763695Ce4177'
        );
        setTodo(Dtodo);
      } else {
        window.alert('Decentragram contract not deployed to detected network.');
      }
    } catch (e) {
      console.log('somethig went wrong', e.message);
    }
  };

  useEffect(() => {
    if (web3 !== '' && account !== '') {
      getTodoABI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, web3]);

  const addTask = async () => {
    try {
      const data = await Todo.methods.addTodo('hey you').send({ from: account });
      console.log(data);
    } catch (e) {
      console.log('error while adding new task', e.message);
    }
  };

  const getAllTodos = async () => {
    try {
      const todos = await Todo.methods.getTodos().call();
      setTodos(todos);
    } catch (e) {
      console.log('getAllTods', e.message);
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
        ></input>
      </div>
      <button className='btn btn-outline-success' onClick={addTask}>
        Add
      </button>
      <div className='list-container p-2'>
        <ul className='list-group list-group-flush' id='list'>
          {lodaing ? (
            <div>Loading</div>
          ) : (
            todos?.map((todo, id) => <div key={id}>
              <li className='list-group-item'>

              </li>
            </div>)
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
