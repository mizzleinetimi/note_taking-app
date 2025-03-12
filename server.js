const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const notesFile = path.join(__dirname, 'notes.json');

app.use(express.json());

// Endpoint to get notes
app.get('/api/notes', (req, res) => {
  if (fs.existsSync(notesFile)) {
    const notes = JSON.parse(fs.readFileSync(notesFile));
    res.json(notes);
  } else {
    res.json([]);
  }
});

// Endpoint to add a note
app.post('/api/notes', (req, res) => {
  let notes = [];
  if (fs.existsSync(notesFile)) {
    notes = JSON.parse(fs.readFileSync(notesFile));
  }
  const newNote = { id: notes.length + 1, content: req.body.content };
  notes.push(newNote);
  fs.writeFileSync(notesFile, JSON.stringify(notes));
  res.status(201).json(newNote);
});

// Serve React App
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});