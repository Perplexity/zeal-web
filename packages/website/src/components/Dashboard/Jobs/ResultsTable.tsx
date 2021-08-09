import { Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Summoner } from "../../../types";
import moment from "moment";
import "moment-duration-format";

const columns = [
	{
		field: "username",
		headerName: "Username",
		width: 150,
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.username}</Typography>;
		},
	},
	{
		field: "password",
		headerName: "Password",
		width: 150,
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.password}</Typography>;
		},
	},
	{
		field: "email_verified",
		headerName: "Email Verified",
		width: 170,
		type: "boolean",
	},
	{
		field: "phone_verified",
		headerName: "Phone Verified",
		width: 175,
		type: "boolean",
	},
	{
		field: "summoner_name",
		headerName: "Name",
		width: 175,
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.summoner_name}</Typography>;
		},
	},
	{
		field: "level",
		headerName: "Level",
		width: 110,
		type: "number",
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.level}</Typography>;
		},
	},
	{
		field: "last_played",
		headerName: "Last Played",
		width: 155,
		renderCell: (params) => {
			const summoner = params.row;
			return (
				<Typography>
					{moment(summoner.last_played).format("DD/MM/YYYY HH:mm")}
				</Typography>
			);
		},
	},
	{
		field: "solo_queue_rank",
		headerName: "Solo Queue",
		width: 155,
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.solo_queue.rank}</Typography>;
		},
	},
	{
		field: "flex_queue_rank",
		headerName: "Flex Queue",
		width: 155,
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.flex_queue.rank}</Typography>;
		},
	},
	{
		field: "riot_points",
		headerName: "RP",
		width: 100,
		type: "number",
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.riot_points}</Typography>;
		},
	},
	{
		field: "blue_essence",
		headerName: "BE",
		width: 100,
		type: "number",
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.blue_essence}</Typography>;
		},
	},
	{
		field: "refund_credits",
		headerName: "Refunds",
		width: 130,
		type: "number",
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.refund_credits}</Typography>;
		},
	},
	{
		field: "champions",
		headerName: "Champions",
		width: 150,
		type: "number",
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.champions.length}</Typography>;
		},
	},
	{
		field: "skins",
		headerName: "Skins",
		width: 120,
		type: "number",
		renderCell: (params) => {
			const summoner = params.row;
			return <Typography>{summoner.skins.length}</Typography>;
		},
	},
	{
		field: "banned",
		headerName: "Banned",
		width: 130,
		type: "boolean",
	},
	{
		field: "toxic_banned",
		headerName: "Toxic",
		width: 130,
		type: "boolean",
	},
];

type Props = {
  results: Summoner[];
};

const ResultsTable = ({ results }: Props): JSX.Element => {
	return (
		<div style={{ height: 500 }}>
			<DataGrid columns={columns} rows={results} disableSelectionOnClick />
		</div>
	);
};

export default ResultsTable;
