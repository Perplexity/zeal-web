import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Container,
	Grid,
	makeStyles,
	TextField,
	Theme,
	Typography,
} from "@material-ui/core";
import logo from "../../images/zeal-logo.png";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import Page from "../../components/Page";
import theme from "../../theme";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		backgroundColor: theme.palette.background.default,
		height: "100%",
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	avatar: {
		width: "128px",
		height: "128px",
		marginBottom: theme.spacing(2),
	},
	submit: {
		marginTop: theme.spacing(2),
	},
	error: {
		marginTop: theme.spacing(2),
	},
}));

const LoginView = (): JSX.Element => {
	const classes = useStyles();
	const [cookies, setCookie] = useCookies();
	const { auth_token } = cookies;
	const authed = auth_token !== undefined;

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | false>(false);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		axios
			.post("/api/user/login", {
				username,
				password,
			})
			.then((response) => {
				const { token } = response.data;
				setCookie("auth_token", token, { path: "/" });
			})
			.catch(() => {
				setError("Invalid username/password");
				setLoading(false);
			});
	};

	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};



	return authed ? <Navigate to="/dashboard" /> : (
		<Page className={classes.root} title="Login">
			<Container component="main" maxWidth="xs">
				<Box display="flex" flexDirection="column" alignItems="center">
					<Avatar src={logo} className={classes.avatar} />
					<Typography component="h1" variant="h1" gutterBottom>
            Sign in
					</Typography>
					<form className={classes.form} onSubmit={handleSubmit}>
						<TextField
							value={username}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							autoFocus
							onChange={handleUsernameChange}
						/>
						<TextField
							value={password}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							onChange={handlePasswordChange}
						/>
						{loading ? (
							<Grid container justify="center">
								<Grid item>
									<CircularProgress style={{ marginTop: theme.spacing(2) }} />
								</Grid>
							</Grid>
						) : (
							<Grid container justify="center">
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
                  Sign In - {process.env.NODE_ENV} || {process.env.TEST_URL}
								</Button>
								{error && (
									<Alert className={classes.error} severity="error">
										{error}
									</Alert>
								)}
							</Grid>
						)}
					</form>
				</Box>
			</Container>
		</Page>
	);
};

export default LoginView;
