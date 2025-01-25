import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const Error = () => {
	const navigate = useNavigate();
	return (
		<div>
			<p>There's been an error!</p>
			<Button onClick={() => navigate(-1)}>Go Back</Button>
		</div>
	);
};

export default Error;
