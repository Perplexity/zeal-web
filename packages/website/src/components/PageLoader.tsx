import { Box, CircularProgress, Container, Grid } from "@material-ui/core";

const PageLoader = (): JSX.Element => {
	return (
		<Box display="flex" flexDirection="column" height="100%" justifyContent="center">
			<Container>
				<Grid container justify="center">
					<CircularProgress />
				</Grid>
			</Container>
		</Box>
	);
};

export default PageLoader;