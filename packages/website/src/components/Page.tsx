import { Helmet } from "react-helmet";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const Page = ({ children, title = "", ...rest }: Props): JSX.Element => {
	return (
		<div {...rest}>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			{children}
		</div>
	);
};

export default Page;
