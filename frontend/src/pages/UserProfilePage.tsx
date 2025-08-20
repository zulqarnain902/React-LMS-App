import { useAuth } from "@/hook/useAuth";
import Layout from "../Layout";
import { Link, Outlet } from "react-router";
import {
	Home,
	Locate,
	LocateIcon,
	Lock,
	Notebook,
	NotebookIcon,
	User,
	UserMinus,
} from "lucide-react";

const UserProfilePage = () => {
	const userfname = useAuth().fname;

	return (
		<Layout>
			<div className="flex">
				{/* Sidebar */}
				<aside className="bg-white dark:bg-gray-800 w-64 min-h-screen p-4 border-r border-gray-200 dark:border-gray-700">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold mb-4">{userfname}'s Profile</h1>
					</div>

					<nav>
						<ul className="space-y-2">
							<li>
								<Link
									to="/profile"
									className="flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
								>
									<Home className="h-6 w-6 mr-3" />
									Overview
								</Link>
							</li>

							<li>
								<Link
									to="/profile/personal-info"
									className="flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
								>
									<User className="h-6 w-6 mr-3" />
									Personal Info
								</Link>
							</li>

							<li>
								<Link
									to="/profile/change-password"
									className="flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
								>
									<Lock className="h-6 w-6 mr-3" />
									Password
								</Link>
							</li>

							<li>
								<Link
									to="/profile/address-info"
									className="flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
								>
									<LocateIcon className="h-6 w-6 mr-3" />
									Address Info
								</Link>
							</li>
							<li>
								<Link
									to="/profile/notes-management"
									className="flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
								>
									<NotebookIcon className="h-6 w-6 mr-3" />
									Notes Management
								</Link>
							</li>
							<li>
								<Link
									to="/profile/account-deletion"
									className="flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
								>
									<UserMinus className="h-6 w-6 mr-3" />
									Delete Account
								</Link>
							</li>
						</ul>
					</nav>
				</aside>

				{/* Main Content */}
				<main className="flex-1 p-6">
					<Outlet />
				</main>
			</div>
		</Layout>
	);
};

export default UserProfilePage;
