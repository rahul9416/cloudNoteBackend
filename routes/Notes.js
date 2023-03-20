const express = require('express');
const router = express.Router();
const fetchuser = require('../midlleware/fetchuser');
const Notes = require('../models/Notes');
const {body, validationResult} = require('express-validator');
const { findByIdAndUpdate } = require('../models/User');

// Route 1: Get all the notes using get: "/api/notes/fetchallnotes". Login Required
router.get('/fetchallnotes', fetchuser,async(req,res)=>{
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes)   
    } catch (error) {
        return res.status(500).send({error:"error occured"})
    }
})

// Route 2: Store the notes using post: "/api/notes/addnotes". Login Required
router.post('/addnotes', fetchuser,async(req,res)=>{
    try {
        const {title,description,color,tag} = req.body;
        
    // If there are errors, return bad request
    const errors = validationResult(req);
    if(!errors.isEmpty()){return res.status(400).json({error: errors.array()})}

    const note = new Notes({
        title,description,color,tag,user : req.user.id
    })


    const saveNote = await note.save();
    res.json({saveNote})
        
    } catch (error) {
        return res.status(500).send({error:"error occured"})
    }
})

// Route 3: Update an existing note using put: "/api/notes/updatenote/:id". Login Required

router.put('/updatenote/:id',fetchuser, async (req, res)=> {
    try {
        const {title,description,tag,date} = req.body;
        
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
        if(date){newNote.date = date};

        // Find the note and update it

        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
        // Check whether the user owns this note
        if(note.user.toString() != req.user.id){return res.status(401).send("Not Allowed")}

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        res.json({note});

    } catch (error) {
        return res.status(500).send({error:"error occured"})
    }

})

// Route 4: Delete an existing note using post: "/api/notes/deletenote/:id". Login Required
router.delete('/deletenote/:id', fetchuser, [
    body('title', 'Enter a valid title').isLength({min:3}),
    body('description', 'Description must be of minimum 5 characters').isLength({min:5})
],async (req, res)=> {
    try{
        // Find the note and note to be deleted
        let note = await Notes.findById(req.params.id);
        
        if(!note){return res.status(404).send("Not Found")}
        // Allow deletion only if user own this note
        if(note.user.toString() != req.user.id){return res.status(401).send("Not Allowed")}
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Deleted"});
    }
    catch (error){
        res.status(500).send("Internal Server Occur")
    }
})

module.exports=router