const Note = require('../models/note.model');
const { createNoteSuccess, editNoteSuccess, editNoteError, deleteNoteSuccess, deleteNoteError, getNoteSuccess, getNoteError, listNoteSuccess } = require('../../config/user-messges');

exports.create = async (req, res, next) => {
  try {
    const { body: payload, userId } = req;
    payload.userId = userId;

    const note = await Note.create(payload);

    if (note) {
      const { _id, title, description } = note;
      const data = { _id, title, description };
      return res.status(201).send({ success: true, message: createNoteSuccess, note: data });
    }
  } catch (error) {
    return next(error);
  }
}

exports.edit = async (req, res, next) => {
  try {
    const { body: { title, description, noteId: _id }, userId } = req;

    const note = await Note.findOneAndUpdate({ _id, userId }, { $set: { title, description } }, { new: true });
    if (note) {
      const { _id, title, description } = note;
      const data = { _id, title, description };
      return res.json({ success: true, message: editNoteSuccess, note: data });
    }
    else
      return res.status(400).send({ success: false, message: editNoteError });
  } catch (error) {
    return next(error);
  }
}

exports.delete = async (req, res, next) => {
  try {
    const { params: { noteId: _id }, userId } = req;

    const note = await Note.findOneAndDelete({ _id, userId });
    if (note)
      return res.json({ success: true, message: deleteNoteSuccess });
    else
      return res.status(400).send({ success: false, message: deleteNoteError });
  } catch (error) {
    return next(error);
  }
}

exports.get = async (req, res, next) => {
  try {
    const { params: { noteId: _id }, userId } = req;

    const note = await Note.findOne({ _id, userId }, 'title description');
    if (note)
      return res.json({ success: true, message: getNoteSuccess, note });
    else
      return res.status(400).send({ success: false, message: getNoteError });
  } catch (error) {
    return next(error);
  }
}

exports.list = async (req, res, next) => {
  try {
    const { userId } = req;

    const notes = await Note.find({ userId }, 'title description');

    return res.json({ success: true, message: listNoteSuccess, notes });
  } catch (error) {
    return next(error);
  }
}