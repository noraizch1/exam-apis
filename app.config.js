module.exports = {
	apps: [
		{
			name: "Exam",
			script: "./app.js",
			instances: "1",
			exec_mode: "cluster",
			watch: true,
			watch_delay: 1000,
			ignore_watch: ["node_modules", "server/public"],
			env: {
				PORT: "3000",
			},
		},
	],
};
