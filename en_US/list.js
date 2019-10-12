// ### Constants ###

const INDEX_DIR = 'indices';
const INDEX_NAME_PARAM = 'indexName';
const INDEX_EXT = '.csv';
const CSV_SEPARATOR = ';';
const ERROR_HEADER = 'Fuck that shit';

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
 * Displays the given message, by setting the header and description to it.
 * @param {String} header - The header to display.
 * @param {String} description - The description to display.
 * @returns {undefined}
 */
function display(header, description) {
	clearTable(true);
	$('#indexName').html(header);
	$('#indexDescription').html(description);
}

/**
 * Displays a generic error message.
 * @param {String} message - The message to display.
 * @returns {undefined}
 */
function displayGenericError(message) {
	display(ERROR_HEADER, message);
}

/**
 * Handles a situation where the given index couldn't have been found.
 * @param {String} name - The name of the index that wasn't found.
 * @returns {undefined}
 */
function handleIndexNotFound(name) {
	display('Not found!', 'The index "' + name + '" doesn\'t exist on the server.');
}

/**
 * Clears the contents of the displayed table.
 * @param {?Boolean} [clearHeaders=false] Whether to clear the header row as well.
 * @returns {undefined}
 */
function clearTable(clearHeaders = false) {
	if (clearHeaders) {
		$('#indexTableHeaderRow').empty();
	}
	$('#indexTableBody').empty();
}

/**
 * Generates a visible table from the given data.
 * @param {Array.<Array.<String>>} data - A 2d-array containing the parsed CSV data.
 * @param {?Boolean} [skipHeaders=false] - Whether to keep the current header row.
 * @returns {undefined}
 */
function generateTable(data, skipHeaders = false) {
	if (!data || !data.length) {
		return;
	}

	// First, clear the table contents
	clearTable(!skipHeaders);

	// Handle the header separately
	if (!skipHeaders) {
		const headerRow = data[0];
		headerRow.forEach(function (header) {
			const headerHTML = '<th scope="col" class="columnHeader" columnName="' + header + '">' + header + '</th>';
			$('#indexTableHeaderRow').append(headerHTML);
		});
	}

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

/**
 * Sorts an array of arrays with respect to the column of the given index.
 * @param {Array.<Array.<String>>} data - A 2d array containing the rows, which then contain the columns to sort.
 * @param {Number} colIndex - The index of the column with respect to which the data shall be sorted.
 * @param {?Boolean} [descending=false] - Whether the sort order should be reversed.
 * @throws {RangeError}
 * @returns {Array.<Array.<String>>} The sorted array.
 */
function sortDataArray(data, colIndex, descending = false) {
	if (!data || !data.length) {
		return [];
	}
	const headerRow = data[0];
	if (colIndex >= headerRow.length) {
		throw new RangeError('Column index ' + colIndex + ' out of range');
	}
	// Get rid of the header, it's not being sorted
	const result = data.slice(1);

	function _sortSingleRowPair(x, y) {
		if (x[colIndex].toLowerCase() < y[colIndex].toLowerCase()) {
			return -1;
		} else if (x[colIndex].toLowerCase() === y[colIndex].toLowerCase()) {
			return 0;
		} else {
			return 1;
		}
	}
	timsort.sort(result, (x, y) => descending ? -1 * _sortSingleRowPair(x, y) : _sortSingleRowPair(x, y));

	// Add the copy of the header row back
	result.unshift(headerRow.slice());

	return result;
}

/**
 * Sorts an array of arrays with respect to the column of the given column name..
 * @param {Array.<Array>} data - A 2d array containing the rows, which then contain the columns to sort.
 * @param {String} colName - The name of the column with respect to which the data shall be sorted.
 * @param {?Boolean} [descending=false] - Whether the sort order should be reversed.
 * @throws {RangeError}
 * @returns {Array.<Array>} The sorted array.
 */
function sortDataArrayByColName(data, colName, descending=false) {
	if (!data || !data.length) {
		return [];
	}
	const headerRow = data[0];
	const colIndex = headerRow.indexOf(colName);

	if (colIndex >= 0) {
		return sortDataArray(data, colIndex, descending);
	} else {
		throw new RangeError('No such column: ' + colName);
	}
}

// ### Script ###

// Get URL query params first
const urlQueryParams = new URLSearchParams(window.location.search);
const indexName = urlQueryParams.get(INDEX_NAME_PARAM);

// Read the data from a corresponding index file
const indexFilePath = INDEX_DIR + '/' + indexName + INDEX_EXT;
const indexFileRaw = loadFile(indexFilePath);

// This is used to keep track of the current sorting settings
let sorting = {
	column: null,
	descending: null
};

$(document).ready(function () {
	if (indexFileRaw) {
		try {
			const indexRows = $.csv.toArrays(indexFileRaw, { separator: CSV_SEPARATOR });
			$('#indexName').html(indexName);
			generateTable(indexRows);

			$('#indexTableHeaderRow').on('click', '.columnHeader', function () {
				const columnName = $(this).attr('columnName');
				let descending = false;
				// If the user clicks the same header with respect to which the data
				//  is already being sorted, just flip the direction.
				if (sorting.column === columnName) {
					descending = !sorting.descending;
				}
				sorting = {
					column: columnName,
					descending: descending
				}
				const sortedData = sortDataArrayByColName(indexRows, columnName, descending);
				generateTable(sortedData);
				// Look for the header with the same column name as the previous one,
				//  and add the fancy arrow symbol next to it.
				// generateTable() resets headers in this case, so the addition has to
				//  be done after that.
				const sortingSymbol = descending ? '↑' : '↓';
				$('.columnHeader').each(function () {
					if ($(this).attr('columnName') === columnName) {
						$(this).append(' ' + sortingSymbol);
					}
				});
			});
		} catch(error) {
			displayGenericError(error);
			throw error;
		}
	} else {
		handleIndexNotFound();
	}
});
