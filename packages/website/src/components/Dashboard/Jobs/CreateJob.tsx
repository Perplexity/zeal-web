import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	colors,
	FormControlLabel,
	Grid,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCreatingJob } from "../../../store/jobsSlice";
import { selectUser } from "../../../store/userSlice";
import MinLevelSlider from "./MinLevelSlider";
import ThreadsSlider from "./ThreadsSlider";
import CrossIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/CheckSharp";
import Selector from "../../Selector";
import { ChangeEvent, useState } from "react";
import theme from "../../../theme";
import Uploader from "../Uploader";
import { BasicCombo } from "../../../types";
import { Alert } from "@material-ui/lab";
import { getAllRegexMatches } from "../../../utils";
import NumberFormat from "react-number-format";

const useStyles = makeStyles(() => ({
	createButton: {
		width: "100%",
		backgroundColor: colors.green[500],
		"&:hover": {
			backgroundColor: colors.green[800],
		},
	},
	cancelButton: {
		width: "100%",
		backgroundColor: colors.red[500],
		"&:hover": {
			backgroundColor: colors.red[800],
		},
	},
}));

const CreateJob = (): JSX.Element => {
	console.log("test change");
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const userState = useAppSelector(selectUser);
	const { user } = userState;
	const [region, setRegion] = useState("EUW");
	const [mode, setMode] = useState("Check");
	const [combosFile, setCombosFile] = useState<File>(null);
	const [combosLoading, setCombosLoading] = useState(false);
	const [combosErrorMessage, setCombosErrorMessage] = useState<string | JSX.Element>(null);
	const [combosSuccessMessage, setCombosSuccessMessage] = useState<string | JSX.Element>(null);
	const [combos, setCombos] = useState<BasicCombo[]>([]);
	const [minLevel, setMinLevel] = useState(30);
	const [checkBanned, setCheckBanned] = useState(false);
	const [threads, setThreads] = useState(1);
	const [submitting, setSubmitting] = useState(false);

	const fileDataLoaded = (e: ProgressEvent<FileReader>) => {
		const pattern = /^(\w+):(\w+)$/gm;
		const matches = getAllRegexMatches(pattern, e.target.result as string);
		const combos: BasicCombo[] = matches.map((match) => {
			return {
				username: match[1],
				password: match[2]
			};
		});
		if (combos.length > 0) {
			if (combos.length > user.license.combo_limit) {
				setCombosErrorMessage(<>Cannot load <strong><NumberFormat value={combos.length} thousandSeparator={true} displayType="text" /></strong> combos, your limit is <strong><NumberFormat value={user.license.combo_limit} thousandSeparator={true} displayType="text" /></strong> per job.</>);
			} else {
				setCombosSuccessMessage(<>Successfully loaded <strong>{combos.length}</strong> combos!</>);
			}
		} else {
			setCombosErrorMessage("No valid combos were found in this file.");
			setCombosFile(null);
		}
		setCombosLoading(false);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCombosSuccessMessage(null);
		setCombosErrorMessage(null);
		const files = e.target.files;
		if (files.length) {
			const file = files[0];
			const parts = file.name.split(".");
			const extension = parts[parts.length - 1];
			if (extension !== "txt") {
				setCombosErrorMessage("Invalid file format. Must be '.txt'");
				return;
			}
			setCombosErrorMessage(null);
			setCombosFile(file);
			const fr = new FileReader();
			fr.onloadend = fileDataLoaded;
			fr.readAsText(file);
			setCombosLoading(true);
		}
	};

	return (
		<Box>
			<Grid container spacing={3}>
				<Grid item xs={6}>
					<Selector
						label="Region"
						value={region}
						options={[
							"EUW",
							"EUNE",
							"NA",
							"LAN",
							"LAS",
							"RU",
							"OCE",
							"BR",
							"TR",
							"JP",
						]}
						onChange={(e) => setRegion(e.target.value)}
					/>
				</Grid>
				<Grid item xs={6}>
					<Selector
						label="Mode"
						value={mode}
						options={["Crack", "Check"]}
						onChange={(e) => setMode(e.target.value)}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={3} style={{ paddingBottom: theme.spacing(2) }}>
				<Grid item xs={12}>
					<Uploader
						label="Combos"
						file={combosFile}
						onChange={handleFileChange}
						onClear={() => setCombosFile(null)}
						loading={combosLoading}
					/>
				</Grid>
				{combosSuccessMessage && (
					<Grid item xs={12}>
						<Alert severity="success">
							<Typography variant="inherit">{combosSuccessMessage}</Typography>
						</Alert>
					</Grid>
				)}
				{combosErrorMessage && (
					<Grid item xs={12}>
						<Alert severity="error">
							<Typography variant="inherit">{combosErrorMessage}</Typography>
						</Alert>
					</Grid>
				)}
			</Grid>
			<Grid container spacing={3}>
				<Grid item xs={6}>
					<MinLevelSlider onChange={(e) => setMinLevel(e.target.value)} />
				</Grid>
				<Grid item xs={6}>
					<FormControlLabel
						labelPlacement="top"
						control={
							<Checkbox
								checked={checkBanned}
								color="primary"
								onChange={(e) => setCheckBanned(e.target.checked)}
							/>
						}
						label="Capture banned accounts"
					/>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<ThreadsSlider
						limit={user.license.thread_limit}
						onChange={(e) => setThreads(e.target.value)}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={3} justify="center">
				{submitting ? (
					<CircularProgress />
				) : (
					<>
						<Grid item xs={6}>
							<Button
								startIcon={<CrossIcon />}
								variant="contained"
								color="primary"
								className={classes.cancelButton}
								onClick={() => dispatch(setCreatingJob(false))}
							>
								Cancel
							</Button>
						</Grid>
						<Grid item xs={6}>
							<Button
								startIcon={<CheckIcon />}
								variant="contained"
								color="primary"
								className={classes.createButton}
								onClick={() => setSubmitting(true)}
								disabled={combosLoading || combosErrorMessage !== null || combosFile === null}
							>
								Create Job
							</Button>
						</Grid>
					</>
				)}
			</Grid>
		</Box>
	);
};

export default CreateJob;
