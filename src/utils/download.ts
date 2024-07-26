export function downloadFromURL(url: string, name = 'file') {
	// Create a link element
	const link = document.createElement("a");

	// Set link's href to point to the Blob URL
	link.href = url;
	link.download = name;

	// Append link to the body
	document.body.appendChild(link);

	// Dispatch click event on the link
	// This is necessary as link.click() does not work on the latest firefox
	link.dispatchEvent(
		new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		})
	);

	// Remove link from body
	document.body.removeChild(link);
}

// This functions take a data uri, example - canvas.toDataURL()
// and return a blob for the same URI
export function dataURItoBlob(dataURI: string) {
	let byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else
		byteString = decodeURI(dataURI.split(',')[1]);

	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	const ia = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {
		type: mimeString
	});
}