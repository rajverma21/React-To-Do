import React, { useState, useEffect } from 'react'
import './App.css'

function App () {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortOption, setSortOption] = useState('creation')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = () => {
    if (input.trim()) {
      setTasks([
        ...tasks,
        { text: input.trim(), completed: false, createdAt: new Date() }
      ])
      setInput('')
    }
  }

  const handleRemoveTask = index => {
    setTasks(prevTasks => prevTasks.filter((_, i) => i !== index))
  }

  const handleCompleteTask = index => {
    setTasks(prevTasks =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: true } : task
      )
    )
  }

  const filteredTasks = tasks.filter(task =>
    filter === 'all'
      ? true
      : filter === 'completed'
      ? task.completed
      : !task.completed
  )

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortOption === 'alphabetical') {
      return a.text.localeCompare(b.text)
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt)
    }
  })

  const getNoTaskMessage = () => {
    if (filter === 'active' && filteredTasks.length === 0) {
      return 'No Active Task'
    }
    if (filter === 'completed' && filteredTasks.length === 0) {
      return 'No Task Completed'
    }
    return null
  }

  return (
    <div className='App'>
      <h1>To-Do List</h1>
      <input
        type='text'
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Add a new task'
      />
      <button onClick={handleAddTask}>Add Task</button>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <div>
        <button onClick={() => setSortOption('creation')}>
          Sort by Creation
        </button>
        <button onClick={() => setSortOption('alphabetical')}>
          Sort Alphabetically
        </button>
      </div>
      <ul>
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task, index) => (
            <li key={index} className={task.completed ? 'completed' : ''}>
              <span>{task.text}</span>
              {!task.completed && (
                <button onClick={() => handleCompleteTask(index)}>
                  Mark as Completed
                </button>
              )}
              <button onClick={() => handleRemoveTask(index)}>Remove</button>
            </li>
          ))
        ) : (
          <li>{getNoTaskMessage()}</li>
        )}
      </ul>
    </div>
  )
}

export default App
