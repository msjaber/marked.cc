export function get_month_name(index) {
	 let months_names = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]

	return months_names[index]
}

// export function generate_strikethrough_element(text) {
// 	let span = document.createElement("span");
// 	span.classList.add("strikethrough");
// 	span.appendChild(document.createTextNode(text))
// 	return span
// }

// export function generate_bold_element(text) {
// 	let span = document.createElement("span");
// 	span.classList.add("bold");
// 	span.appendChild(document.createTextNode(text))
// 	return span
// }

// export function generate_highlighted_element(text, background_color) {
// 	let span = document.createElement("span");
// 	span.classList.add("highlighted");
// 	span.appendChild(document.createTextNode(text))
// 	span.style.backgroundColor = background_color
// 	return span
// }

// Encode an SVG element as a base64 data uri.
export function svgToBase64Image(svgElement) {
	var div = document.createElement('div');
	div.appendChild(svgElement.cloneNode(true));
	var b64 = window.btoa(div.innerHTML);
	return 'data:image/svg+xml;base64,' + b64;
}