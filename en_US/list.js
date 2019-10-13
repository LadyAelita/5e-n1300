// ### Constants ###

const INDEX_DIR = 'indices';
const INDEX_NAME_PARAM = 'indexName';
const INDEX_EXT = '.csv';
const CSV_SEPARATOR = ';';
const TAG_SEPARATOR = ',';
const SEARCH_CRITERIA_SEPARATOR = ',';
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
			if (header.charAt(0) === '!') {
				// Ignore special column headers
				return;
			}
			const headerHTML = '<th scope="col" class="columnHeader" columnName="' + header + '">' + header + '</th>';
			$('#indexTableHeaderRow').append(headerHTML);
		});
	}

	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		let rowHTML = '<tr>';
		let href; // For potential hyperlinks

		// jNonSpecial is the index of the current column in the array, but only
		//  if the array contained nothing but non-special columns
		for (let j = 0, jNonSpecial = 0; j < row.length; j++) {
			const cell = row[j];

			if (cell.columnType === 'href') {
				href = cell.value;
			}

			// Don't render any special columns
			if (cell.columnType) {
				continue;
			}

			let cellHTML;
			const cellID = 'cell' + jNonSpecial + 'x' + i;
			if (jNonSpecial === 0) {
				cellHTML = '<th scope="row" id="' + cellID + '">' + cell.value + '</th>';
			} else {
				cellHTML = '<td>' + cell.value + '</td>';
			}
			rowHTML += cellHTML;

			jNonSpecial++;
		}

		rowHTML += '</tr>';
		$('#indexTableBody').append(rowHTML);

		// If there was a hyperlink given, apply it
		if (href) {
			const hrefTargetCellID = 'cell0x' + i;
			$('#' + hrefTargetCellID).wrapInner('<a href="' + href + '"></a>');
		}
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
		if (x[colIndex].value.toLowerCase() < y[colIndex].value.toLowerCase()) {
			return -1;
		} else if (x[colIndex].value.toLowerCase() === y[colIndex].value.toLowerCase()) {
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
	if (!colName) {
		return data.map((row) => row.slice());
	}
	const headerRow = data[0];
	const colIndex = headerRow.indexOf(colName);

	if (colIndex >= 0) {
		return sortDataArray(data, colIndex, descending);
	} else {
		throw new RangeError('No such column: ' + colName);
	}
}

/**
 * Filters an array of arrays, leaving only those rows, that contain the given
 *  criteria.
 * @param {Array.<Array.<String>>} data - A 2d array containing the rows to be filtered.
 * @param {Array.<String>} criteria - An array of criteria joint with a logical AND.
 * @returns {Array.<Array.<String>>} A filtered array.
 */
function filterData(data, criteria) {
	if (!data || !data.length) {
		return [];
	}
	if (!criteria || !criteria.length) {
		return data.map((row) => row.slice());
	}

	// Trim & convert all criteria to lowercase at this point, to avoid doing that
	//  multiple times in the loop below
	criteria = criteria.map((criterion) => criterion.trim().toLowerCase());

	// Never filter out the header
	let filteredData = [];
	filteredData.push(data[0].slice());

	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		if (criteria.every((criterion) => row.some(function (cell) {
			if (!cell.columnType) {
				return cell.value.toLowerCase().includes(criterion);
			} else if (cell.columnType === 'tags') {
				const tags = cell.value.split(TAG_SEPARATOR);
				return tags.some((tag) => tag.toLowerCase() === criterion);
			} else {
				return false;
			}
		}))) {
			filteredData.push(row);
		}
	}
	return filteredData;
}

function gatherSpecialColumnInfo(data) {
	if (!data || !data.length) {
		return new Map();
	}
	const headerRow = data[0];

	// Gather special column info
	const specialColIndices = new Map();
	for (let i = 0; i < headerRow.length; i++) {
		const header = headerRow[i];
		if (header.startsWith('!')) {
			specialColIndices.set(i, header.slice(1).trim().toLowerCase());
		}
	}

	return specialColIndices;
}

function parseCSVData(rawData) {
	const data = $.csv.toArrays(rawData, { separator: CSV_SEPARATOR });
	const specialColIndices = gatherSpecialColumnInfo(data);

	let parsedData = [];
	// Don't convert headers into objects, start from the next row
	parsedData.push(data[0]);
	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		let newRow = [];
		for (let j = 0; j < row.length; j++) {
			const cell = row[j];
			const cellObject = {
				value: cell,
				columnType: specialColIndices.get(j)
			};
			newRow.push(cellObject);
		}
		parsedData.push(newRow);
	}
	return parsedData;
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
			$('#indexName').html(indexName);
			const indexRows = parseCSVData(indexFileRaw);
			generateTable(indexRows);
			// Create a deep(ish) copy of the data
			let filteredRows = indexRows.map((row) => row.slice());

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
				const sortedData = sortDataArrayByColName(filteredRows, columnName, descending);
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

			// Handle the search input
			$('#indexSearchInput').change(function () {
				const criteria = $(this).val().split(SEARCH_CRITERIA_SEPARATOR);
				if (criteria && criteria.length) {
					filteredRows = filterData(indexRows, criteria);
				} else {
					filteredRows = filterData(indexRows, []);
				}
				const sortedData = sortDataArrayByColName(filteredRows, sorting.column, sorting.descending);
				// We skip the headers here, no need to change them as the sorting
				//  hasn't changed.
				generateTable(sortedData, true);
			});
		} catch(error) {
			displayGenericError(error);
			throw error;
		}
	} else {
		handleIndexNotFound();
	}
});
