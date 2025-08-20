import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { CirclePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes } from "@/redux/noteSlice";

const Notes = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(fetchNotes());
	}, []);

	const [searchTerm, setSearchTerm] = useState(String);

	const notes = useSelector((state: any) => state.note.notes) || [];
	const totalNotes = notes.length || 0;
	const filteredNotes = notes.filter((note: any) =>
		note.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleAddNote = () => {
		navigate("/add-note");
	};

	return (
		<div className="container mx-auto p-4  max-h-full ">
			{/* Add Note Button */}
			<div className="flex justify-between items-center w-full gap-8">
				<Button
					className="w-1/2 h-12 text-xl font-bold py-2"
					onClick={handleAddNote}
				>
					<CirclePlus className="inline" />
					Add Course
				</Button>
				<span className="text-end text-xl font-bold py-2">
					Total courses: {totalNotes}
				</span>
			</div>
			<hr className="my-6 border-gray-300" />
			{totalNotes === 0 ? (
				<div className="p-4 h-full flex justify-center items-center">
					<h2 className="text-xl font-bold text-red-600">No course found!</h2>
				</div>
			) : (
				<>
					{/* Search Note */}
					<div className="mt-4 relative w-full">
						<div className="flex items-center gap-4 w-full">
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search Notes by Title..."
								className="border border-gray-300 rounded-lg py-2 px-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							{searchTerm && (
								<button
									type="button"
									className="absolute right-3 text-primary text-xl"
									onClick={() => setSearchTerm("")}
									aria-label="Clear search"
								>
									<X />
								</button>
							)}
						</div>
					</div>
					{/* Notes List */}
					<div className="mt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{(filteredNotes.length > 0 ? filteredNotes : notes).map(
								(note: any) => (
									<div
										key={note._id}
										className="bg-primary/30 p-4 rounded-lg shadow-md overflow-hidden cursor-pointer"
										onClick={() => navigate(`/note/${note._id}`)}
									>
										<h3 className="text-lg font-semibold">{note.title}</h3>
										<span className="text-xs text-gray-600">
											{note?.createdAt
												? new Date(note.createdAt).toDateString()
												: "No date available"}
										</span>
										<div
											className="mt-2 h-[6rem] overflow-hidden hover:overflow-auto text-ellipsis"
											dangerouslySetInnerHTML={{ __html: note.content }}
										/>
									</div>
								)
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Notes;
