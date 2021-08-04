import Queue from "bull";
import "../../pre-start";

const jobQueue = new Queue("job-queue", {
	redis: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT),
	},
});

export default jobQueue;