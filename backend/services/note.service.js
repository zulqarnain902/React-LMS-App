const Note = require('../model/note.model');

const NoteService = {

    WelcomeNote: async (user) => {
        try {
            const note = new Note({
                title: 'Welcome to the Notes App!',
                content: `Hello <strong>${user.fname},</strong> welcome to your personal notes space!`,
                userId: user._id
            });
            await note.save();
            console.log('Welcome note created successfully for user:', user.email);
        } catch (error) {
            console.error('Error creating welcome note:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
module.exports = NoteService;