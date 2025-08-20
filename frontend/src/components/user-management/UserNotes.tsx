import { useState } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hook/useAuth";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { deleteAllNotes } from "@/api/noteApis";
import { clearNotes } from "@/redux/noteSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useNotes } from "@/hook/useNotes";

export const UserNotes = () => {
	const user = useAuth();
	const notes = useNotes();
	const [open, setOpen] = useState(false);
	const [verificationText, setVerificationText] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const openModal = () => {
		setOpen(true);
	};

	const handleAllNotesDeletion = async (e) => {
		e.preventDefault();
		if (!user || !user._id) {
			toast.error("You are not logged in.");
			navigate("/login");
			return;
		}
		if (verificationText !== `Delete ${user.fname} Notes`) {
			toast.error("Verification text does not match.");
			return;
		}
		try {
			const response = await deleteAllNotes(user._id);
			console.log(">>>: Delete All Notes API Response:", response);
			if (response.status === 200 || response.auth === false) {
				dispatch(clearNotes());
				toast.success("All notes deleted successfully.");
				// navigate("/");
			} else {
				toast.error(response.response.data.message);
			}
		} catch (error: any) {
			console.error("Error deleting notes:", error);
			toast.error("Something went wrong while deleting notes.");
		} finally {
			setVerificationText("");
			setOpen(false);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>User Notes Management</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col justify-center items-start">
						{/* Delete All Notes */}
						<div className="w-full flex justify-between items-center gap-2">
							<div className="flex flex-col gap-2 mb-4">
								<h3 className="text-2xl font-bold text-red-500">
									Delete All Your Notes
								</h3>
								<p className="text-md text-gray-800 font-bold">
									This action will delete all your notes permanently.
								</p>
							</div>
							<div>
								<CardAction>
									<Button
										variant="outline"
										onClick={openModal}
										className="bg-red-300 hover:bg-red-400"
									>
										Delete All Notes
									</Button>
								</CardAction>
							</div>
						</div>
						<hr className="my-4 w-full" />
						{/* View Notes in Table */}
						<div className="w-full flex-col justify-between items-center gap-2">
							<div className="flex justify-between items-center gap-2 mb-4">
								<h3 className="text-2xl font-bold text-primary">
									View All Your Notes:
								</h3>
								{/* User Notes Count */}
								<h3 className="text-2xl font-bold">
									Total Notes:{" "}
									<span className="text-2xl font-bold text-primary">
										{notes.length === 0 ? "No notes found!" : notes.length}
									</span>
								</h3>
							</div>

							{/* row */}
							<div>
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Note ID
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Title
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Content
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Created At
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Action
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{notes.length > 0 ? (
											notes.map(
												(note: {
													_id: string;
													title: string;
													content: string;
													createdAt: string;
												}) => (
													<tr key={note._id}>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															{note._id}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 ">
															{note.title}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{note.content.length > 50 ? (
																<div
																	className="text-start overflow-hidden text-ellipsis"
																	dangerouslySetInnerHTML={{
																		__html:
																			note.content.substring(0, 50) + "...",
																	}}
																/>
															) : (
																<div
																	dangerouslySetInnerHTML={{
																		__html: note.content,
																	}}
																/>
															)}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{new Date(note.createdAt).toDateString()}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
															<Button
																variant="outline"
																className="hover:bg-primary/70 hover:text-white"
																onClick={() => navigate(`/note/${note._id}`)}
															>
																View
															</Button>
														</td>
													</tr>
												)
											)
										) : (
											<tr>
												<td
													colSpan={5}
													className="px-6 py-4 text-center text-sm text-gray-500"
												>
													No notes found.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Modal */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete All Your Notes</DialogTitle>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleAllNotesDeletion}>
						<div>
							<Label htmlFor="verificationText" className="mb-2">
								Type verification text:{" "}
								<span className="font-bold text-red-500 bg-red-100 p-1">
									Delete {user.fname} Notes
								</span>
							</Label>
							<Input
								id="verificationText"
								type="text"
								placeholder={`Delete ${user.fname} Notes`}
								required
								value={verificationText}
								onChange={(e) => setVerificationText(e.target.value)}
							/>
						</div>
						<DialogFooter>
							<div className="w-full flex flex-col ">
								<p className="text-md text-gray-800 font-bold text-end">
									This action will delete all your notes permanently.
								</p>
								<br />
								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										type="reset"
										onClick={() => setOpen(false)}
									>
										Cancel
									</Button>
									<Button type="submit" className="bg-red-400 hover:bg-red-500">
										Delete Notes!
									</Button>
								</div>
							</div>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};
