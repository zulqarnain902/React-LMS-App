import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';
import { getNotes } from "@/api/noteApis";


export const fetchNotes = createAsyncThunk("fetchNotes", async () => {
    try {
        const response = await getNotes();
        if (response.status !== 200) {
            throw new Error(response.response.data.message);
        }
        return response.data.notes || [];
    } catch (error) {
        // console.error(">>: Error fetching notes:", error);
        throw Error(error);
    }
});

const initialState = {
    notes: localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : []
};

const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        addNote: (state, action) => {
            state.notes.push(action.payload);
            localStorage.setItem("notes", JSON.stringify(state.notes));
        },
        removeNote: (state, action) => {
            const updatedNotes = state.notes.filter(note => note._id !== action.payload);
            state.notes = updatedNotes.length > 0 ? updatedNotes : [];
            localStorage.setItem("notes", JSON.stringify(state.notes));

        },
        clearNotes: (state) => {
            state.notes = [];
            localStorage.setItem("notes", JSON.stringify(state.notes));
        },
        updateNote: (state, action) => {
            const index = state.notes.findIndex(note => note._id === action.payload._id);
            if (index !== -1) {
                state.notes[index] = action.payload;
                localStorage.setItem("notes", JSON.stringify(state.notes));
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase('fetchNotes/fulfilled', (state, action) => {
                state.notes = action.payload;
                localStorage.setItem("notes", JSON.stringify(state.notes));
                toast.success("Notes fetched successfully!");
            })
            .addCase('fetchNotes/rejected', (state, action) => {
                // toast.error("Failed to fetch notes!");
                toast.error(action.error.message);
            });
    }
})

export const { addNote, removeNote, clearNotes, updateNote } = noteSlice.actions
export default noteSlice.reducer