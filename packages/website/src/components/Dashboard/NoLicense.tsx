import {
	Box,
	Grid,
	TextField,
	Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState } from "react";
import { getUser, redeemKey } from "../../api/user";
import { useAppDispatch } from "../../app/hooks";
import { setUser } from "../../store/userSlice";
import theme from "../../theme";
import PurchaseLicenseButton from "../Buttons/PurchaseLicenseButton";
import RedeemLicenseButton from "../Buttons/RedeemLicenseButton";
const NoLicense = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const [redeeming, setRedeeming] = useState(false);
	const [license_key, setLicenseKey] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLicenseKey(e.target.value);
	};

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			setLoading(true);
			setError(null);
			try {
				await redeemKey(license_key);
				getUser().then((myUser) => {
					dispatch(setUser(myUser));
				});
			} catch (e) {
				setError(e);
				setLoading(false);
			}
		}
	};
	return (
		<Box id="no-license-container">
			<Grid container justify="center" spacing={3}>
				<Grid item xs={12}>
					<Typography align="center" variant="subtitle1" color="textSecondary">
            You do not currently have an active license.
					</Typography>
				</Grid>
				<Grid item>
					<PurchaseLicenseButton />
				</Grid>
				<Grid item>
					<RedeemLicenseButton onClick={() => setRedeeming(true)} />
				</Grid>
			</Grid>
			{redeeming && (
				<Grid container style={{ marginTop: theme.spacing(3) }}>
					<Grid item style={{ width: "100%" }}>
						<TextField
							disabled={loading}
							value={license_key}
							style={{ width: "100%" }}
							label="Enter license key"
							helperText="Press Enter to redeem key"
							variant="outlined"
							onChange={handleLicenseChange}
							onKeyDown={handleKeyDown}
						/>
					</Grid>
					{error && (
						<Grid container justify="center">
							<Grid item>
								<Alert severity="error">{error}</Alert>
							</Grid>
						</Grid>
					)}
				</Grid>
			)}
		</Box>
	);
};

export default NoLicense;
