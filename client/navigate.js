import $ from "jquery";

const viewLoader = require.context("./views"),
	  controllerLoader = require.context("./controllers"),
	  pageElement = $("#page");

let currentView = null;

export function navigate(path, ctx = {}) {
	const file = `./${path}`;
	let template = viewLoader(file);
	if (typeof template === "function") {
		template = template(ctx);
	}
	pageElement.html(template);
	if (currentView !== null) {
		controllerLoader(`./${currentView}`).destroy();
	}
	controllerLoader(file).create(ctx);
	currentView = path;
}