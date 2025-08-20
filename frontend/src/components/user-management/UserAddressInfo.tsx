import React, { useState } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Edit } from "lucide-react";
import { useAuth } from "@/hook/useAuth";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { updateUserById } from "@/api/userApis";
import { updateUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

type AddressFormData = {
	streetAddress: string;
	city: string;
	country: string;
};

export const UserAddressInfo = ({ editButtonMode = true }) => {
	const user = useAuth();
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<AddressFormData>({
		defaultValues: {
			streetAddress: user.streetAddress,
			city: user.city,
			country: user.country,
		},
	});

	const openModal = () => {
		reset({
			streetAddress: user.streetAddress,
			city: user.city,
			country: user.country,
		});
		setOpen(true);
	};

	const onSubmit = async (data: AddressFormData) => {
		console.log("Updated Address Data:", data);

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

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>User Address Information</CardTitle>
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
						<div className="flex flex-col gap-4">
							<div className="flex justify-between space-x-8">
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-gray-400">
										Street Address:
									</span>
									<span className="font-bold">{user.streetAddress}</span>
								</div>
							</div>
							<div className="flex justify-between space-x-8">
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-gray-400">
										City:
									</span>
									<span className="font-bold">{user.city}</span>
								</div>
								<div className="flex flex-col space-y-1.5">
									<span className="text-sm font-medium text-gray-400">
										Country:
									</span>
									<span className="font-bold">{user.country}</span>
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
						<DialogTitle>Update Address Information</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<Label htmlFor="streetAddress" className="mb-2">
								Street Address
							</Label>
							<Input
								id="streetAddress"
								{...register("streetAddress", {
									required: "Street Address is required",
									maxLength: {
										value: 100,
										message: "Street Address cannot exceed 100 characters",
									},
									minLength: {
										value: 10,
										message: "Street Address must be at least 10 characters",
									},
								})}
							/>
							{errors.streetAddress && (
								<p className="text-red-500 text-sm">
									{errors.streetAddress.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="city" className="mb-2">
								City
							</Label>
							<Input
								id="city"
								{...register("city", {
									required: "City Name is required",
									maxLength: {
										value: 15,
										message: "City Name cannot exceed 15 characters",
									},
									minLength: {
										value: 3,
										message: "City Name must be at least 3 characters",
									},
								})}
							/>
							{errors.city && (
								<p className="text-red-500 text-sm">{errors.city.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="country" className="mb-2">
								Country
							</Label>
							<Input
								id="country"
								{...register("country", {
									required: "Country Name is required",
									maxLength: {
										value: 15,
										message: "Country Name cannot exceed 15 characters",
									},
									minLength: {
										value: 3,
										message: "Country Name must be at least 3 characters",
									},
								})}
							/>
							{errors.country && (
								<p className="text-red-500 text-sm">{errors.country.message}</p>
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
