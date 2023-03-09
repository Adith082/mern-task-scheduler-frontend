import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import Task from "./Task"
import TaskForm from "./TaskForm"
import axios from "axios";
import { URL } from "../App";
import loadingImage from "../assets/loader.gif";
const TaskList = () => {
  const [tasks,setTasks] = useState([]);
  const [completedTasks,setCompletedTasks] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [formData,setFormData] = useState({
    name:"",
    completed:false
  });
  const [isEditing,setIsEditing] = useState(false);
  const [taskID,setTaskID] = useState(""); 
  const {name} = formData
  const handleInputChange = (e) => {
     const {name,value} = e.target;
     setFormData({...formData ,[name] : value})
  }
  

  const getTasks = async (e) =>{
    setIsLoading(true);
    try {
       const {data} = await axios.get(`${URL}/api/tasks`);
       console.log(data);
       setTasks(data);
       setIsLoading(false);
    } catch (error) {
       toast.error(error.message);
       setIsLoading(false);
    }
  }
  useEffect(()=>{
      getTasks();
  },[]);


  const createTask = async (e) => {
   e.preventDefault();
   if(name === ""){
      toast.error("Input Field is Empty");  
    } else{
        console.log(URL);
      try {
        await axios.post(`${URL}/api/tasks`,formData);
        toast.success("Task Created Successfully");
        setFormData({...formData,name:""})
        getTasks();
      } catch (error) {
           
           toast.error(error.message);
           console.log(error); 
      }
    }
  }
  const deleteTask = async (id) => {
      try {
        await axios.delete(`${URL}/api/tasks/${id}`);
        getTasks();
      } catch (error) {
        toast.error(error.message);
      }
  }
  const getSingleTask = async (task) => {
    setFormData({name:task.name,completed:false});
    setTaskID(task._id);
    setIsEditing(true);
  }
  const updateTask = async (e) => {
    e.preventDefault();
    if(name === ""){
      toast.error("Input field must be filled");
    }else{
      try {
        await axios.put(`${URL}/api/tasks/${taskID}`,formData);
        setFormData({...formData,name:""});
        setIsEditing(false);
        getTasks();
      } catch (error) {
        toast.error(error.message);
      }
    }
  }
  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name ,
      completed: true
    }
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`,newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(()=>{
      const cTasks = tasks.filter((task)=>{
        return task.completed === true;
      })
      setCompletedTasks(cTasks);
  },[tasks])
  return (
    <div>
        <h2>Task Scheduler</h2>
        <TaskForm name={name} handleInputChange={handleInputChange} createTask={createTask} isEditing={isEditing} updateTask={updateTask}/>
        {tasks.length > 0 && (
        <div className="--flex-between --pb">
            <p>
               <b>Total tasks:</b> {tasks.length}
            </p>
            <p>
                <b>Completed tasks:</b> {completedTasks.length}
            </p>
        </div>)}
        
        <hr/>
           {
            isLoading && (
              <div className="--flex-center">

                <img src={loadingImage} alt="Loading"/>      
           
              </div>
            )
           }
           {
            !isLoading && tasks.length === 0 ? (
                <p className="--py">No Task has been added</p>
            ):(
              <>
              {
              tasks.map((task,index)=>{

                return (
                  <Task key={task._id} task={task} index={index} deleteTask={deleteTask} getSingleTask={getSingleTask} setToComplete={setToComplete}/>
                )
                
                })
                }
              </>
               
              
            )
            }
    </div>
  )
}

export default TaskList