//voor het verwijderen van de DB de volgende regel in de console typen: indexedDB.deleteDatabase("focusTrackerDB");\\

let db;

function initDB() {
	const request = indexedDB.open("focusTrackerDB", 1);

	request.onupgradeneeded = function (event) {
		db = event.target.result;

		const store = db.createObjectStore("activities", {
			keyPath: "id",
			autoIncrement: true,
		});
	};

	request.onsuccess = function (event) {
		db = event.target.result;
		console.log("Database ready");
	};

	request.onerror = function () {
		console.log("Database error");
	};
}

function saveActivityToDB(activity) {
	if (!db) {
		console.log("DB not ready yet");
		return;
	}
	const transaction = db.transaction(["activities"], "readwrite");
	const store = transaction.objectStore("activities");

	const request = store.add(activity);

	request.onsuccess = function () {
		console.log("Activity saved");
		renderActivities();
	};

	request.onerror = function () {
		console.log("Error saving activity");
	};
}

function getActivitiesFromDB(callback) {
	if (!db) {
		console.log("Database not ready yet (getting activities)");
		return;
	}

	const transaction = db.transaction(["activities"], "readonly");
	const store = transaction.objectStore("activities");

	const request = store.getAll();

	request.onsuccess = function () {
		callback(request.result);
	};

	request.onerror = function () {
		console.log("Error on retrieving activities");
	};
}

function getTaskSwitchesByDay(dateString, callback) {
	console.log("deze functie loopt TSBD");
	getActivitiesFromDB(function (activities) {
		const dayActivities = activities.filter((activity) => {
			console.log("ook de dayactivities");
			const startDay = new Date(activity.start).toISOString().slice(0, 10);
			return startDay === dateString;
		});

		const switches = Math.max(0, dayActivities.length - 1);

		callback(switches);
	});
}
