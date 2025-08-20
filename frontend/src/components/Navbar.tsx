import { useAuth } from "@/hook/useAuth";
import { Github, LogIn, LogOut, Menu, Notebook, X } from "lucide-react";
import { Link, useNavigate, NavLink } from "react-router";
import { logout } from "../api/userApis";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { useState } from "react";
import { Button } from "./ui/button";
import Weather from "./weather";

const Navbar = () => {
	const user = useAuth();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = async () => {
		try {
			if (!user || !user._id) {
				toast.error("You are not logged in.");
				return;
			}

			const response = await logout(user._id);
			if (response.auth === false) {
				dispatch(logoutUser());
				toast.success("Logout successful!");
				navigate("/login");
			} else {
				toast.error(response.message || "Logout failed.");
			}
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Logout failed. Please try again.");
		}
	};

	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		isActive
			? "ml-5 text-white font-semibold"
			: "ml-5 text-white/70 hover:text-white";

	return (
		<header className="text-gray-400 bg-gray-900 body-font">
			<div className="container mx-auto flex flex-wrap p-5 flex-row justify-center items-center">
				<Link
					to="/"
					className="flex title-font font-medium items-center text-white mb-0"
				>
					<Notebook className="w-10 h-10 text-white" />
					<span className="ml-3 text-xl">LMS System</span>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700 md:flex flex-wrap items-center text-base justify-center">
					<NavLink to="/" className={navLinkClass}>
						Home
					</NavLink>
					<NavLink to="/add-note" className={navLinkClass}>
						Add Course
					</NavLink>
					{user && (
						<NavLink to="/profile" className={navLinkClass}>
							Profile
						</NavLink>
					)}
					<NavLink to="/weather" className={navLinkClass}>
						Weather
					</NavLink>
					{!user && (
						<NavLink
							to="/register"
							className={navLinkClass}
							onClick={() => setMenuOpen(false)}
						>
							Register
						</NavLink>
					)}
				</nav>

				{/* Auth Buttons + GitHub */}
				<div className="hidden md:flex items-center gap-4">
					{user ? (
						<Button
							onClick={handleLogout}
							className="flex items-center gap-2 border-2 border-white px-3 py-1 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
						>
							{user.fname}, Logout <LogOut className="ml-2" size={18} />
						</Button>
					) : (
						<Button
							onClick={() => navigate("/login")}
							className="flex items-center gap-2 border-2 border-white px-3 py-1 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
						>
							Login <LogIn className="ml-2" size={18} />
						</Button>
					)}
					<Link
						to="https://github.com/zulqarnain902/"
						target="_blank"
						className="flex items-center gap-2 border-2 border-white text-white px-3 py-1 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
					>
						<h2 className="text-sm font-bold">GitHub</h2>
						<Github className="ml-2 size-5" />
					</Link>
				</div>

				{/* Mobile Menu Toggle */}
				<Button
					aria-label="Toggle Menu"
					onClick={() => setMenuOpen(!menuOpen)}
					className="md:hidden ml-auto text-white
					flex items-center justify-center bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
				>
					{menuOpen ? <X className="w-16 " /> : <Menu className="w-16" />}
				</Button>
			</div>

			{/* Mobile Nav */}
			{menuOpen && (
				<div className="md:hidden bg-primary px-5 pb-4">
					<nav className="flex flex-col gap-3 border-t-2 border-white pt-4">
						<NavLink
							to="/"
							className={navLinkClass}
							onClick={() => setMenuOpen(false)}
						>
							Home
						</NavLink>
						<NavLink
							to="/add-note"
							className={navLinkClass}
							onClick={() => setMenuOpen(false)}
						>
							Add Course
						</NavLink>
						{user && (
							<NavLink
								to="/profile"
								className={navLinkClass}
								onClick={() => setMenuOpen(false)}
							>
								Profile
							</NavLink>
						)}
						{!user && (
							<NavLink
								to="/register"
								className={navLinkClass}
								onClick={() => setMenuOpen(false)}
							>
								Register
							</NavLink>
						)}
						<Link
							to="https://github.com/zulqarnain902/"
							target="_blank"
							className="flex items-center gap-2 border-2 border-white text-white px-3 py-1 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
						>
							<h2>Checkout my GitHub</h2>
							<Github className="size-5" />
						</Link>
						{user ? (
							<Button
								onClick={() => {
									handleLogout();
									setMenuOpen(false);
								}}
								className="flex items-center gap-2 border-2 border-white text-white px-3 py-1 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
							>
								{user.fname}, Logout <LogOut className="ml-2" size={18} />
							</Button>
						) : (
							<Button
								onClick={() => {
									navigate("/login");
									setMenuOpen(false);
								}}
								className="flex items-center gap-2 border-2 border-white text-white px-3 py-1 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
							>
								Login <LogIn className="ml-2" size={18} />
							</Button>
						)}
					</nav>
				</div>
			)}
		</header>
	);
};

export default Navbar;
