import { UserPersonalInfo } from "./UserPersonalInfo";
import { UserAddressInfo } from "./UserAddressInfo";

export const UserOverview = () => {
	return (
		<div>
			<UserPersonalInfo editButtonMode={false} />
			<br />
			<hr />
			<br />
			<UserAddressInfo editButtonMode={false} />
		</div>
	);
};
