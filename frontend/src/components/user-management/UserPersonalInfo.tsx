import React, { useState } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Edit, User } from "lucide-react";
import { useAuth } from "@/hook/useAuth";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { updateUserById } from "@/api/userApis";
import { updateUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

type FormData = {
	fname: string;
	lname: string;
};

export const UserPersonalInfo = ({ editButtonMode = true }) => {
	const user = useAuth();
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			fname: user.fname,
			lname: user.lname,
		},
	});

	const onSubmit = async (data: FormData) => {
		try {
			const response = await updateUserById(user._id, data);
			if (response.status === 200) {
				// Update user context or state if necessary
				dispatch(
					updateUser({ ...response.data.user, auth: response.data.auth })
				);
				toast.success("User information updated successfully.");
			} else {
				toast.error(response.response.data.message);
			}
		} catch (error: any) {
			console.error("Error updating user:", error);
			toast.error("Something went wrong while updating user information.");
		}

		setOpen(false);
	};

	const openModal = () => {
		reset({
			fname: user.fname,
			lname: user.lname,
		});
		setOpen(true);
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>User Personal Information</CardTitle>
					{editButtonMode && (
						<CardAction>
							<Button variant="outline" onClick={openModal}>
								<Edit className="mr-2" />
								Edit
							</Button>
						</CardAction>
					)}
				</CardHeader>
				<CardContent>
					<div className="flex flex-col justify-center items-start">
						<div className="flex justify-between items-center space-x-4">
							<User className="w-24 h-24 bg-primary/20 rounded-full mb-4 border-2 border-black/10" />
							<div className="flex flex-col justify-center space-y-4">
								<h3 className="font-bold text-2xl">
									{user.fname + " " + user.lname}
								</h3>
								<p className="text-sm font-medium text-gray-400">
									{user.country}
								</p>
							</div>
						</div>
						<hr className="w-full my-2" />
						<div className="mt-2 flex flex-col gap-4">
							<div className="flex justify-between space-x-8">
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-gray-400">
										First Name:
									</span>
									<span className="font-bold">{user.fname}</span>
								</div>
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-gray-400">
										Last Name:
									</span>
									<span className="font-bold">{user.lname}</span>
								</div>
							</div>
							<div className="flex justify-between space-x-8">
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-gray-400">
										Email:
									</span>
									<span className="font-bold">{user.email}</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Modal */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Profile Information</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<Label htmlFor="fname" className="mb-2">
								First Name
							</Label>
							<Input
								id="fname"
								{...register("fname", {
									required: "First Name is required",
									maxLength: {
										value: 20,
										message: "First Name cannot exceed 20 characters",
									},
									minLength: {
										value: 3,
										message: "First Name must be at least 3 characters",
									},
								})}
							/>
							{errors.fname && (
								<p className="text-red-500 text-sm">{errors.fname.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="lname" className="mb-2">
								Last Name
							</Label>
							<Input
								id="lname"
								{...register("lname", {
									required: "Last Name is required",
									maxLength: {
										value: 15,
										message: "Last Name cannot exceed 15 characters",
									},
									minLength: {
										value: 3,
										message: "Last Name must be at least 3 characters",
									},
								})}
							/>
							{errors.lname && (
								<p className="text-red-500 text-sm">{errors.lname.message}</p>
							)}
						</div>

						<DialogFooter>
							<Button
								variant={"outline"}
								type="button"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Save Changes</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};
