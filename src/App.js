import './App.css';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import TodoHead from './components/TodoHead';
import NewAdd from './components/NewAdd';
import MainItems from './components/MainItems';
import Filter from './components/Filter';
import Footer from './components/Footer';
import useWindowSize from './hooks/useWindowSize';

function App() {

  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [active, setActive] = useState([]);
  const [current, setCurrent] = useState("all")
  const [width] = useWindowSize();
  const newTaskRef = useRef(null);
  const storageTask = "taskKey";
  const themeStorage = "themeKey";

  function loadThemeFromStorage() {
    const { dark } = JSON.parse(localStorage.getItem(themeStorage)) ?? {};
    return { dark };
  };

  const [theme, setTheme] = useState(loadThemeFromStorage());

  useEffect(() => {
    //setting tasklists
    const loadedTask = JSON.parse(localStorage.getItem(storageTask))
    loadedTask && loadedTask.length > 0 && setTasks(loadedTask)

    //change theme
    changeTheme(true);
  }, [])

  useEffect(() => {
    //store tasks into storage
    localStorage.setItem(storageTask, JSON.stringify(tasks))

    //update completed items
    setCompleted(tasks.filter(task => task.complete))

    //update active items
    setActive(tasks.filter(task => !task.complete))
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(themeStorage, JSON.stringify(theme))
    console.log(theme)
  }, [theme])

  function addTask() {
    const newTask = newTaskRef.current.value;
    newTask && setTasks(oldTasks =>
      [...oldTasks, { id: uuidv4(), item: newTask, complete: false }]);
    newTaskRef.current.value = null;
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))
  }

  function completeTask(id) {
    setTasks(tasks.map(task => {
      return task.id === id ? { ...task, complete: !task.complete } : task;
    }))
  }

  function clearCompleted() {
    setTasks(tasks.filter(task => !task.complete))
  }

  function changeCurrent(e) {
    setCurrent(e.target.className.split(" ")[0])
  }

  function conditionalTaskList() {
    if (current === "all") {
      return tasks
    }
    else if (current === "active") {
      return active
    }
    else {
      return completed
    }
  }

  function changeTheme(initial = false) {
    if (!initial) {
      if (!theme || !theme.dark) { //light turns to dark
        for (let vars of Object.keys(varTheme)) {
          document.documentElement.style.setProperty(`--${vars}`, varTheme[vars][0]);
        }
        setTheme({ ...theme, dark: true })
      }
      else {
        for (let vars of Object.keys(varTheme)) { //dark turns to light
          document.documentElement.style.setProperty(`--${vars}`, varTheme[vars][1]);
        }
        setTheme({ ...theme, dark: false })
      }
    }
    else {
      if (!theme || theme.dark) { //light stays light
        for (let vars of Object.keys(varTheme)) {
          document.documentElement.style.setProperty(`--${vars}`, varTheme[vars][0]);
        }
        setTheme({ ...theme, dark: true })
      }
      else {
        for (let vars of Object.keys(varTheme)) { //dark stays dark
          document.documentElement.style.setProperty(`--${vars}`, varTheme[vars][1]);
        }
        setTheme({ ...theme, dark: false })
      }
    }
  }

  let varTheme = {
    mainBackground: ["hsl(235, 21%, 11%)", "hsl(236, 33%, 92%)"],
    itemsBackground: ["hsl(235, 24%, 19%)", "hsl(0, 0%, 98%)"],
    firstFont: ["hsl(236, 33%, 92%)", "hsl(236, 33%, 92%)"],
    secondFont: ["hsl(234, 11%, 52%)", "hsl(236, 9%, 61%)"],
    thirdFont: ["hsl(234, 39%, 85%)", "hsl(235, 19%, 35%)"],
    fourthFont: ["hsl(233, 14%, 35%)", "hsl(233, 11%, 84%)"],
    border: ["hsl(233, 14%, 35%)", "hsl(236, 33%, 92%)"]
  }

  const opts = {
    enableMouseEvents: true,
  }

  return (
    <DndProvider backend={TouchBackend} options={opts}>
      <header className={`${!theme || !theme.dark ? "" : "dark"}`}></header>
      <TodoHead theme={theme} changeTheme={changeTheme} />
      <NewAdd ref={newTaskRef} onClick={addTask} />
      <MainItems width={width}
        tasks={conditionalTaskList()}
        setTasks={setTasks}
        onDelete={deleteTask}
        onToggle={completeTask}
        onClear={clearCompleted}
        onCurrent={changeCurrent}
        current={current} />
      {width < 768 && < Filter onCurrent={changeCurrent} current={current} />}
      <p>Drag and drop to reorder list</p>
      <Footer />
    </DndProvider>
  );
}

export default App;
