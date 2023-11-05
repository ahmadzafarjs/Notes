require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000


mongoose.connect(process.env.DB_URL)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', () => {
  console.log('connected to db')
})
const notesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  notes: {
    type: String
  }
})
const Notes = mongoose.model('Notes', notesSchema)
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})
app.post('/', (req, res) => {
  const newNotes = new Notes({
    name: req.body.fname,
    notes: req.body.notes
  })
  newNotes.save()
  res.redirect('/')

})
// Find All Data
app.get('/api/getAll', async (req, res)=> {
  try {
  const data = await Notes.find()
  res.json(data)
  } catch (error){
    console.log("error")
  }
})

// Find by ID
app.get('/api/getOne/:id', async (req, res)=> {
  try{
    const data = await Notes.find({"name": req.params.id});
    res.json(data)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.listen(port, () => {
  console.log("Server Starts on 3000")
})
