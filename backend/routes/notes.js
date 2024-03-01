const routes = require('express').Router();
const { body, validationResult } = require('express-validator');
const Notes = require('../models/notes');
const authtoken = require('../middleware/authtoken');

routes.post('/createnote', authtoken, [
  body('title').isLength({ min: 3 }),
  body('description').isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const note = new Notes({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag
    });
    await note.save();
    res.send(note);
  } catch (error) {
    console.error('Error saving the note:', error);
    res.status(500).json({ errors: [{ msg: 'There was an error processing your request.' }] });
  }
});

routes.get('/getusernotes', authtoken, async (req, res) => {
  try {
    const id = req.user.id;
    const notes = await Notes.find({user:id});
    res.send(notes);
    }
  catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ errors: [{ msg: 'There was an error processing your request.' }] });
  }
});

routes.put('/updatenote/:id', authtoken, async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ errors: [{ msg: 'Note not found' }] });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: [{ msg: 'Access Denied' }] });
    }
    note.title = req.body.title;
    note.description = req.body.description;
    note.tag = req.body.tag;
    await note.save();
    res.send(note);
  } catch (error) {
    console.error('Error updating the note:', error);
    res.status(500).json({ errors: [{ msg: 'There was an error processing your request.' }] });
  }
});

routes.delete('/delnote/:id', authtoken, async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ errors: [{ msg: 'Note not found' }] });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: [{ msg: 'Access Denied' }] });
    }
    await Notes.findByIdAndDelete(req.params.id);
    res.send({ msg: 'Note removed' });
  } catch (error) {
    console.error('Error deleting the note:', error);
    res.status(500).json({ errors: [{ msg: 'There was an error processing your request.' }] });
  }
});
module.exports = routes;