let currentActivity = null;
let timerInterval = null;

//Code voor de activiteitsknoppen\\

function startActivity(context) {
	if (currentActivity) stopActivity(); //stoppen van oude vorige activiteit

	const startTime = new Date();

	currentActivity = {
		context: context,
		start: startTime,
		distractions: 0,
	};

	document.getElementById("context").innerText = context;

	startTimer();
}

//code voor de timer\\
function startTimer() {
	timerInterval = setInterval(() => {
		const now = new Date();
		const diff = now - currentActivity.start;

		const seconds = Math.floor(diff / 1000) % 60;
		const minutes = Math.floor(diff / 60000) % 60;
		const hours = Math.floor(diff / 3600000) % 60;

		document.getElementById("timer").innerText = `${pad(hours)}:${pad(
			minutes,
		)}:${pad(seconds)}`;
	}, 1000);
}

//code voor de stopknop\\
function stopActivity() {
	if (!currentActivity) return;

	clearInterval(timerInterval);

	const endTime = new Date();
	const duration = endTime - currentActivity.start;

	const completedActivity = {
		context: currentActivity.context,
		start: currentActivity.start,
		end: endTime,
		duration: duration,
		distractions: currentActivity.distractions,
	};

	saveActivityToDB(completedActivity);

	document.getElementById("context").innerText = "";
	document.getElementById("timer").innerText = "00:00:00";
	document.getElementById("distractions").innerText = "Afleidingen: 0";

	currentActivity = null;

	renderActivities();
	switchesToday();
}

//de functie voor de vlinderknop
function registerDistraction() {
	if (!currentActivity) return;

	currentActivity.distractions++;
	document.getElementById("distractions").innerText =
		"Afleidingen: " + currentActivity.distractions;
}

//Code voor het tonen van de opgeslagen activiteiten\\

function renderActivities() {
	getActivitiesFromDB(function (activities) {
		const list = document.getElementById("activityList");
		list.innerHTML = "";

		activities.forEach((activity) => {
			const item = document.createElement("li");

			const start = new Date(activity.start).toLocaleTimeString();
			const end = new Date(activity.end).toLocaleTimeString();

			item.innerText = `${activity.context} | ${start} - ${end} | Afleidingen: ${activity.distractions}`;

			list.appendChild(item);
		});
	});
}

//Tonen van het aantal switches op een dag
function switchesToday() {
	const today = new Date().toISOString().slice(0, 10);

	getTaskSwitchesByDay(today, function (switches) {
		console.log("Aantal taakwissels vandaag: ", switches);
		document.getElementById("switchesToday").innerText =
			"Taakwissels vandaag: " + switches;
	});
}

//het tonen van de timer getallen\\
function pad(num) {
	return num.toString().padStart(2, "0");
}

initDB();
