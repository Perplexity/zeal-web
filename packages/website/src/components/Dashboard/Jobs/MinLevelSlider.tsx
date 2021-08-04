import { Box, Slider, Typography } from '@material-ui/core';

type Props = {
  onChange?: (event: React.ChangeEvent<{ value: number }>) => void;
};

const MinLevelSlider = ({ onChange }: Props) => {
  return (
    <Box>
      <Typography gutterBottom><strong>Min. Level</strong></Typography>
      <Slider
        defaultValue={30}
        valueLabelDisplay="auto"
        step={1}
        min={1}
        max={500}
        onChange={onChange}
      ></Slider>
    </Box>
  );
};

export default MinLevelSlider;
