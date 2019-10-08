// ### Constants ###

const INDEX_DIR = 'indices';
const INDEX_NAME_PARAM = 'indexName';
const INDEX_EXT = '.csv';
const CSV_SEPARATOR = ';';

// ### Helper functions ###

/**
 * Loads a file from the given path on the server.
 * @see https://stackoverflow.com/a/41133213
 * @param {String} filePath - The path to the file.
 * @returns {String} The acquired data.
 */
function loadFile(filePath) {
	var result = null;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	xmlhttp.send();
	if (xmlhttp.status==200) {
		result = xmlhttp.responseText;
	}
	return result;
}

/**
 * Handles a situation where the given index couldn't have been found.
 * @param {String} name - The name of the index that wasn't found.
 * @returns {undefined}
 */
function handleIndexNotFound(name) {
	$('#indexName').html('Not found!');
	$('#indexDescription').html('The index "' + name + '" doesn\'t exist on the server.');
}

/**
 * Generates a visible table from the given data.
 * @param {Array.<Array.<String>>} data - A 2d-array containing the parsed CSV data.
 * @returns {undefined}
 */
function generateTable(data) {
	if (!data || !data.length) {
		return;
	}

	// First handle the header;
	const headerRow = data[0];
	headerRow.forEach(function (header) {
		const headerHTML = '<th scope="col">' + header + '</th>';
		$('#indexTableHeaderRow').append(headerHTML);
	});

	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		let rowHTML = '<tr>';

		for (let j = 0; j < row.length; j++) {
			const cell = row[j];
			let cellHTML;
			if (j === 0) {
				cellHTML = '<th scope="row">' + cell + '</th>';
			} else {
				cellHTML = '<td>' + cell + '</td>';
			}
			rowHTML += cellHTML;
		}

		rowHTML += '</tr>';
		$('#indexTableBody').append(rowHTML);
	}
}

// ### Script ###

// Get URL query params first
const urlQueryParams = new URLSearchParams(window.location.search);
const indexName = urlQueryParams.get(INDEX_NAME_PARAM);

// Read the data from a corresponding index file
const indexFilePath = INDEX_DIR + '/' + indexName + INDEX_EXT;
const indexFileRaw = loadFile(indexFilePath);

$(document).ready(function () {
	if (indexFileRaw) {
		const indexRows = $.csv.toArrays(indexFileRaw, {
			separator: CSV_SEPARATOR
		});
		$('#indexName').html(indexName);
		generateTable(indexRows);
	} else {
		handleIndexNotFound();
	}
});
