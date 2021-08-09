import { Box, Slider, Typography } from "@material-ui/core";

type Props = {
  limit: number;
  onChange?: (event: React.ChangeEvent<{ value: number }>) => void;
}

const ThreadsSlider = ({limit, onChange}: Props): JSX.Element => {
	return (
		<Box>
			<Typography gutterBottom>Threads</Typography>
			<Slider
				defaultValue={1}
				valueLabelDisplay="auto"
				step={1}
				min={1}
				max={limit}
				onChange={onChange}
			/>
		</Box>
	);
};

export default ThreadsSlider;
