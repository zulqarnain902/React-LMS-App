import { useSelector } from "react-redux";

export const useNotes = () => {
	const notes = useSelector((state) => state.note.notes);
	// console.log("User notes:", notes);
	return notes;
};
