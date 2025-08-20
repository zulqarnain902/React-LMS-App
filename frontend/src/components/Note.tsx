import { Copy, Edit, Share2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { removeNote } from "../redux/noteSlice";
import { deleteNote } from "../api/noteApis";

export const Note = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const noteContentRef = useRef<HTMLDivElement>(null);
	const notes = useSelector((state: any) => state.note.notes);
	const singleNote = notes.find((note: any) => note._id === id);

	const handleEditNote = () => {
		if (singleNote) {
			navigate(`/add-note/?editNoteId=${singleNote._id}`);
		}
	};
	const handleDeleteNote = async () => {
		try {
			if (!singleNote) {
				return;
			}
			const response = await deleteNote(singleNote._id);
			if (response.status !== 200) {
				toast.error(response.data.message || "Failed to delete note!");
				return;
			} else {
				dispatch(removeNote(singleNote._id));
				toast.success("Note deleted successfully!");
				navigate("/");
			}
		} catch (error) {
			toast.error("Failed to delete note!");
			console.error("Error deleting note:", error);
		}
	};

	if (!singleNote) {
		return (
			<div className="container mx-auto p-4  h-screen max-h-full flex justify-center items-center">
				<span className="text-xl font-bold text-red-600">Note not found!</span>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 min-h-full ">
			{/* Add Note Button */}
			<div className="flex justify-center items-center w-full gap-8">
				<span className="w-full text-center text-2xl font-bold py-2 text-primary">
					View Note
				</span>
			</div>
			<hr className="my-6 border-gray-300" />
			<div className="mt-4 relative w-full h-full">
				{/* Buttons */}
				<div className="flex justify-between items-center gap-4 w-full">
					<span className="text-md font-semibold py-2 w-full">
						{singleNote?.createdAt
							? new Date(singleNote.createdAt).toDateString()
							: "No date available"}
					</span>
					<div className="flex justify-end items-center gap-4 w-full">
						<Button
							className="text-xl font-bold py-2 bg-green-600 hover:bg-green-700"
							onClick={handleEditNote}
						>
							<Edit className="inline size-5" />
							Edit Note
						</Button>
						<Button
							className="text-xl font-bold py-2 bg-red-600 hover:bg-red-700"
							onClick={handleDeleteNote}
						>
							<Trash className="inline size-5" />
							Delete Note
						</Button>
					</div>
				</div>
				<div className="mt-4 flex justify-between items-center gap-4 bg-primary/20  rounded-lg p-4 w-full">
					<h2 className="text-center text-xl font-bold ">
						Note Title:{" "}
						<span className="ml-2 text-primary">{singleNote?.title}</span>
					</h2>
					<Copy
						className="hover:text-primary size-5 cursor-pointer"
						onClick={() =>
							navigator.clipboard.writeText(singleNote?.title || "")
						}
					/>
				</div>
				<div className="mt-4 flex flex-col justify-start items-start gap-2 w-full transition-all duration-300 ease-in-out">
					<div className="flex justify-between items-center gap-4 w-full">
						<h2 className=" text-xl font-bold  w-full">Note Content: </h2>
						<Copy
							className="hover:text-primary size-5 cursor-pointer mr-4"
							onClick={() =>
								navigator.clipboard.writeText(
									noteContentRef.current?.innerText || ""
								)
							}
						/>
						<Share2
							className="hover:text-primary size-5 cursor-pointer mr-4"
							onClick={() =>
								navigator.share({
									title: singleNote?.title,
									text: noteContentRef.current?.innerText || "",
								})
							}
						/>
					</div>
					<h2 className=" text-xl font-normal bg-primary/20  rounded-lg p-6 w-full">
						<div
							ref={noteContentRef}
							dangerouslySetInnerHTML={{ __html: singleNote?.content }}
						/>
					</h2>
				</div>
			</div>
		</div>
	);
};
