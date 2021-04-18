import React from 'react';
import io from 'socket.io-client';
import uniqid from 'uniqid';

class App extends React.Component {
  
  state = {
    tasks: [],
    taskName: ''
  };
  
  componentDidMount = () => {
    this.socket = io.connect('http://localhost:8000/');
    this.socket.on('removeTask', (task) => this.removeTask(task));
  };

  removeTask = (id) => {
    const itemToBeRemoved = this.tasks.find(tasks => tasks[id] === this.socket[id]);
    const removedTask = this.tasks.indexOf(itemToBeRemoved);
    this.tasks.splice(removedTask, 1);
    this.socket.emit('removeTask', id);
  };

  submitForm = (event) => {
    event.preventDefault();

    const task = { id: uniqid(), name: this.state.taskName };
    this.addTask(task);
    this.socket.emit('addTask', task);
    this.setState({
      task: [...this.state.tasks, task],
    });
  };

  addTask = (task) => {
    
  };

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task) => (
              <li className="task" key={task.id}>
                {task.name}
                <button 
                  className="btn btn--red"
                  onClick={() => this.removeTask(task.id)}
                >
                Remove
                </button>
              </li>
            ))}
              
          </ul>
    
          <form id="add-task-form" onSubmit={(submit) => this.submitForm(submit)}>
            <input 
            className="text-input" 
            autoComplete="off" 
            type="text" 
            placeholder="Type your description" 
            id="task-name"
            value={taskName} 
            onChange={(event) => this.setState({taskName: event.target.value})}
            />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;
