import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addNote, updateNote } from "@/redux/noteSlice";
import { createNote, modifyNote } from "@/api/noteApis";

const AddNote = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [noteTitle, setNoteTitle] = useState(String);
	const editorRef = useRef<any>(null);
	const notes = useSelector((state: any) => state.note.notes || []);

	// Edit Note
	const [searchParams, setSearchParams] = useSearchParams();
	const [editNoteId, setEditNoteId] = useState(searchParams.get("editNoteId"));

	const editNote = notes.find((note: any) => note._id === editNoteId);
	const [editTitle, setEditTitle] = useState(editNote?.title || "");
	const [editContent, setEditContent] = useState(editNote?.content || "");

	useEffect(() => {
		if (editNoteId) {
			if (editNote) {
				setNoteTitle(editTitle);
			}
		}
	}, [editNoteId, editNote]);

	const handleSave = async () => {
		if (editorRef.current) {
			if (editNoteId) {
				// Update existing note
				const updatedContent = editorRef.current.getContent();
				// console.log("Updating Note:", editNoteId, noteTitle, updatedContent);
				//*** */ // Update note in zustand store
				// updateNote(editNoteId, {
				// 	title: noteTitle,
				// 	content: updatedContent,
				// 	createdAt: new Date().toDateString(),
				// });
				try {
					const response = await modifyNote(editNoteId, {
						title: noteTitle,
						content: updatedContent,
					});
					if (response.status === 200) {
						dispatch(updateNote(response.data.note));
						toast.success("Note updated successfully!");
					} else {
						toast.error(response.data.message || "Failed to save note.");
						return;
					}
				} catch (error) {
					toast.error("Failed to save note.");
					return;
				}
			} else {
				// Create new note
				if (!noteTitle.trim()) {
					toast.error("Please enter a title for the note.");
					return;
				}
				const content = editorRef.current.getContent();
				try {
					const response = await createNote({
						title: noteTitle,
						content: content,
					});
					if (response.status === 201) {
						console.log(">>:CreateNote Response:", response);
						console.log(">>:CreateNote Response Data:", response.data.note);
						dispatch(addNote(response.data.note));
						toast.success("Note saved successfully!");
					} else {
						toast.error(response.data.message || "Failed to save note.");
						return;
					}
				} catch (error) {
					toast.error("Failed to save note.");
					return;
				}
			}
		}
		// Reset form fields
		setNoteTitle("");
		editorRef.current.setContent("");
		setEditContent("");
		setEditTitle("");
		setSearchParams({});
		if (editNoteId) {
			setEditNoteId("");
		}
		// Navigate to home page
		navigate("/");
	};
	const handleCancel = () => {
		setNoteTitle("");
		editorRef.current.setContent("");
		navigate("/");
		toast.error("Note Discarded.");
	};

	return (
		<div className="container mx-auto p-4 min-h-screen flex flex-col items-start gap-6">
			<div className="flex flex-col items-start justify-center w-full max-w-sm  gap-3">
				<Label htmlFor="title">Course Title:</Label>
				<Input
					type="title"
					id="title"
					placeholder="Title"
					value={noteTitle}
					onChange={(e) => setNoteTitle(e.target.value)}
				/>
			</div>
			<div className="flex flex-col items-start w-full gap-3">
				<Label htmlFor="note">Course Content:</Label>
				<Editor
					apiKey={"g2jvscq5zdijzan4pn4dhhmgudhokuhpri0d1jqw34b8d62r"}
					onInit={(evt, editor) => {
						editorRef.current = editor;
						evt = evt;
					}}
					init={{
						height: 320,
						menubar: false,
						plugins: [
							"advlist",
							"autolink",
							"lists",
							"link",
							"image",
							"charmap",
							"preview",
							"anchor",
							"searchreplace",
							"visualblocks",
							"code",
							"fullscreen",
							"insertdatetime",
							"media",
							"table",
							"code",
							"help",
							"wordcount",
						],
						toolbar:
							"undo redo | blocks | " +
							"bold italic forecolor | alignleft aligncenter " +
							"alignright alignjustify | bullist numlist outdent indent | " +
							"removeformat | help",
						content_style:
							"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
					}}
					initialValue={editNote ? editNote.content : "Write your note here..."}
					value={editContent}
					onEditorChange={(content) => setEditContent(content)}
				/>
			</div>
			<div className="flex justify-start items-center w-full gap-8">
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
			</div>
		</div>
	);
};

export default AddNote;
