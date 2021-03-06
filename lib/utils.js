'use strict';

// Convert square-bracket to dot notation.
exports.toDotNotation = function (str) {
	return str.replace(/\[((.)*?)\]/g, ".$1");
};

// Gets nested properties without throwing errors.
exports.getProp = function (property, obj) {
	var levels = exports.toDotNotation(property).split(".");

	while (obj !== null && obj !== undefined && levels[0]) {
		obj = obj[levels.shift()];
		if (obj === null || obj === undefined) obj = "";
	}

	return obj;
};

// Sets nested properties.
exports.setProp = function (property, obj, value) {
	var levels = exports.toDotNotation(property).split(".");

	while (levels[0]) {
		var p = levels.shift();
		if (typeof obj[p] !== "object") obj[p] = {};
		if (!levels.length) obj[p] = value;
		obj = obj[p];
	}

	return obj;
};

exports.clone = function (obj) {
	return JSON.parse(JSON.stringify(obj));
};

/**
 * camelize(str): -> String
 * - str (String): The string to make camel-case.
 *
 * Converts dash-separated words into camelCase words. Cribbed from Prototype.js.
 *
 * field-name -> fieldName
 * -field-name -> FieldName
**/
exports.camelize = function (str) {
	return (str || "").replace(/-+(.)?/g, function (match, chr) {
		return chr ? chr.toUpperCase() : '';
	});
};

/*
 * Recursively merge properties of two objects
 * http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically/383245#383245
 */
exports.merge = function (obj1, obj2) {
	for (var p in obj2) {
		try {
			// Property in destination object set; update its value.
			if (obj2[p].constructor === Object) {
				obj1[p] = exports.merge(obj1[p], obj2[p]);
			} else {
				obj1[p] = obj2[p];
			}
		} catch (e) {
			// Property in destination object not set; create it and set its value.
			obj1[p] = obj2[p];
		}
	}
	return obj1;
};

exports.mergeSources = function (sources, req) {
	var data = {};
	sources.forEach(function (source) {
		exports.merge(data, req[source]);
	});
	return data;
};

exports.hasValue = function (value) {
	return !(undefined === value || null === value || "" === value || (Array.isArray(value) && value.length === 0));
};

exports.coerce = function (input) {
	if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
		input = '';
	} else if (typeof input === 'object' && input !== null && input.toString) {
		input = input.toString();
	}
	return input + '';
};
