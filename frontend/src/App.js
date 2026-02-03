import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button, TextField, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: ""
  });

  const [file, setFile] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("deadline", form.deadline);
    if (file) formData.append("file", file);

    await axios.post("http://localhost:5000/api/tasks", formData);
    setOpen(false);
    fetchTasks();
  };

  const markDone = async (id) => {
    await axios.patch(`http://localhost:5000/api/tasks/${id}/done`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  const downloadFile = (id) => {
    window.open(`http://localhost:5000/api/tasks/${id}/file`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Manager</h1>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Task
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tasks.map(task => (
            <TableRow key={task._id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.deadline.slice(0,10)}</TableCell>
              <TableCell>{task.displayStatus}</TableCell>
              <TableCell>
                <Button onClick={() => markDone(task._id)}>Done</Button>
                <Button onClick={() => downloadFile(task._id)}>View File</Button>
                <Button color="error" onClick={() => deleteTask(task._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Task Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title"
            onChange={e => setForm({...form, title: e.target.value})} />

          <TextField fullWidth label="Description"
            onChange={e => setForm({...form, description: e.target.value})} />

          <TextField fullWidth type="date"
            onChange={e => setForm({...form, deadline: e.target.value})} />

          <input type="file" accept="application/pdf"
            onChange={e => setFile(e.target.files[0])} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
