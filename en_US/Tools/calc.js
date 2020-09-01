// ### Constants ###

const LOCALE = window.location.pathname.split('/')[1];
const PORT = window.location.port;
const FULL_HOST = window.location.hostname + (PORT ? ':' + PORT : '');
const URL_BASE = window.location.protocol + '//' + FULL_HOST + '/' + LOCALE;

const NAV_FILE_PATH = URL_BASE + '/navigation.md';

const CLASSES_MAX_NUMBER = 3;
const MAX_ORDER = 9;

const CLASS_BASE_SPELLS_KNOWN_DESCRIPTORS = {
	'Artificer': 'Artificer spells',
	'Bard': 'Bard spells',
	'Cleric': 'Cleric spells',
	'Druid': 'Druid spells',
	'Paladin': 'Paladin spells',
	'Ranger': 'Ranger spells',
	'Sorcerer (Prophetus)': 'Sorcerer spells',
	'Warlock (Vilos)': 'Warlock spells',
	'Wizard (Incantator)': 'Wizard spells written in your spellbook'
};

const THIRD_CASTER_UNRESTRICTED_SPELLS_KNOWN_DESCRIPTOR = 'Wizard spells of any school or element';
const VOW_OF_DIVINITY_SPELLS_KNOWN_DESCRIPTOR = 'Cleric spells';

const THIRD_CASTER_RESTRICTED_SPELLS_KNOWN_DESCRIPTORS = {
	'Arcane Trickster': 'Wizard Enchantment or Illusion spells',
	'Eldritch Knight': 'Wizard Abjuration or Evocation spells',
	'Shadow': 'Wizard Darkness spells'
};

const SPELL_SLOT_PROGRESSION = {
	1: [null, 2],
	2: [null, 3],
	3: [null, 4, 2],
	4: [null, 4, 3],
	5: [null, 4, 3, 2],
	6: [null, 4, 3, 3],
	7: [null, 4, 3, 3, 1],
	8: [null, 4, 3, 3, 2],
	9: [null, 4, 3, 3, 3, 1],
	10: [null, 4, 3, 3, 3, 2],
	11: [null, 4, 3, 3, 3, 2, 1],
	12: [null, 4, 3, 3, 3, 2, 1],
	13: [null, 4, 3, 3, 3, 2, 1, 1],
	14: [null, 4, 3, 3, 3, 2, 1, 1],
	15: [null, 4, 3, 3, 3, 2, 1, 1, 1],
	16: [null, 4, 3, 3, 3, 2, 1, 1, 1],
	17: [null, 4, 3, 3, 3, 2, 1, 1, 1, 1],
	18: [null, 4, 3, 3, 3, 3, 1, 1, 1, 1],
	19: [null, 4, 3, 3, 3, 3, 2, 1, 1, 1],
	20: [null, 4, 3, 3, 3, 3, 2, 2, 1, 1]
};

const VOW_OF_DIVINITY_SPELL_SLOT_PROGRESSION = {
	3: [3, 2],
	4: [4, 3],
	5: [4, 3],
	6: [4, 3],
	7: [5, 4, 2],
	8: [6, 4, 2],
	9: [6, 4, 2],
	10: [7, 4, 3],
	11: [8, 4, 3],
	12: [8, 4, 3],
	13: [9, 4, 3, 2],
	14: [10, 4, 3, 2],
	15: [10, 4, 3, 2],
	16: [11, 4, 3, 3],
	17: [11, 4, 3, 3],
	18: [11, 4, 3, 3],
	19: [12, 4, 3, 3],
	20: [13, 4, 3, 3]
};

const ATTRIBUTE_FULL_NAMES = {
	str: 'Strength',
	dex: 'Dexterity',
	con: 'Constitution',
	int: 'Intelligence',
	wis: 'Wisdom',
	cha: 'Charisma'
};

// ### Globals ###
var g_classNames = [];
var g_classData = {};
var g_attributes = {
	str: undefined,
	dex: undefined,
	con: undefined,
	int: undefined,
	wis: undefined,
	cha: undefined
};
var g_playerClasses = [
	{
		className: undefined,
		subclass: undefined,
		level: undefined
	},
	{
		className: undefined,
		subclass: undefined,
		level: undefined
	},
	{
		className: undefined,
		subclass: undefined,
		level: undefined
	}
];
var g_resultsSectionOriginalHtml;

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
 * Converts a number into roman numerals.
 * @see https://stackoverflow.com/a/9083076
 * @param {Number} num
 * @returns {String} Roman version of the number.
 */
function romanize(num) {
	if (isNaN(num))
		return NaN;
	var digits = String(+num).split(""),
		key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
			   "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
			   "","I","II","III","IV","V","VI","VII","VIII","IX"],
		roman = "",
		i = 3;
	while (i--)
		roman = (key[+digits.pop() + (i * 10)] || "") + roman;
	return Array(+digits.join("") + 1).join("M") + roman;
}

/**
 * Handles an error.
 * @param {String} errorMsg - The error message to display.
 */
function throwError(errorMsg) {
	if(errorMsg) {
		alert('Sie zjebalo\n\n' + errorMsg);
	} else {
		alert('Sie zjebalo');
	}
}

/**
 * Creates an array with the given item repeated n times.
 * @param {*} item
 * @param {Number} n
 * @returns {Array.<*>} An array with the element repeated n times.
 */
function fillArray(item, n) {
	return Array.apply(null, Array(n)).map((oldItem) => item);
}

/**
 * Finds ability modifier from its value.
 */
function getAbilityModifier(value) {
	return Math.floor((value - 10) / 2);
}

/**
 * Finds proficiency bonus based on level.
 * @param {Number} totalLevel
 * @returns {Number}
 */
function getProficiencyBonus(totalLevel) {
	return Math.ceil(1 + totalLevel / 4);
}

/**
 * Calculates the spell attack modifier.
 * @param {Number} abilityModifier
 * @param {Number} totalLevel
 * @returns {Number}
 */
function getSpellAttackModifier(abilityModifier, totalLevel) {
	return abilityModifier + getProficiencyBonus(totalLevel);
}

/**
 * Calculates the spell DC.
 * @param {Number} abilityModifier
 * @param {Number} totalLevel
 * @returns {Number}
 */
function getSpellDC(abilityModifier, totalLevel) {
	return 8 + getSpellAttackModifier(abilityModifier, totalLevel);
}

/**
 * Writes the number in the modifier notation, leading it with a + sign for non-negative numbers.
 * @param {Number} mod
 * @returns {String}
 */
function applyModifierNotation(mod) {
	if (mod >= 0) {
		return '+' + mod;
	} else {
		return '' + mod;
	}
}

/**
 * From among the class and the subclass, returns the one that refers to the
 *  source of the spellcasting feature.
 * @param {String} className
 * @param {String} subclass
 * @returns {String} Name of the class or subclass that provides spellcasting.
 */
function getCasterClassOrSubclassName(className, subclass) {
	if (['Eldritch Knight', 'Arcane Trickster', 'Shadow', 'Vow of Divinity'].includes(subclass)) {
		return subclass;
	} else {
		return className;
	}
}

/**
 * Determines the shorthand for the class-subclass combination's spellcasting
 *  ability.
 * @param {String} className
 * @param {String} subclass
 * @returns {String} Shorthand for the spellcasting ability, such as 'wis' or 'int'.
 */
function getSpellcastingAttributeAbbreviation(className, subclass) {
	if (['Cleric', 'Druid', 'Ranger'].includes(className) || ['Vow of Divinity'].includes(subclass)) {
		return 'wis';
	}
	else if (['Artificer', 'Wizard (Incantator)'].includes(className) || ['Eldritch Knight', 'Arcane Trickster', 'Shadow'].includes(subclass)) {
		return 'int';
	}
	else if (['Bard', 'Sorcerer (Prophetus)', 'Warlock (Vilos)', 'Paladin'].includes(className)) {
		return 'cha';
	}
	else {
		return null;
	}
}

/**
 * Determines how many spellcaster levels does the class contribute toward
 *  the multiclass spellcasting table.
 * @param {String} className
 * @param {String} subclass
 * @param {Number} level
 * @returns {Number}
 */
function getMulticlassCasterLevelContribution(className, subclass, level) {
	if (level <= 0) {
		return 0;
	}
	else if (['Bard', 'Cleric', 'Druid', 'Sorcerer (Prophetus)', 'Wizard (Incantator)'].includes(className)) {
		return level;
	}
	else if (['Artificer'].includes(className)) {
		return Math.floor(level / 2);
	}
	else if (['Paladin', 'Ranger'].includes(className)) {
		return (level < 2 ? 0 : Math.floor(level / 2));
	}
	else if (['Vow of Divinity'].includes(subclass)) {
		// TODO: No idea what to do with this unique slot progression at the moment,
		//  so let's treat it as exactly what it is - unique, just like the Vilos.
		return 0;
	}
	else if (['Eldritch Knight', 'Arcane Trickster', 'Shadow'].includes(subclass)) {
		return (level < 3 ? 0 : Math.floor(level / 3));
	}
	else {
		return 0;
	}
}

/**
 * Determines how many spells can be prepared as part of this class on the
 *  given level.
 * @param {Object} attributes
 * @param {String} className
 * @param {String} subclass
 * @param {Number} level - Level in that specific class.
 * @returns {?Number} The number of spells that the character can prepare from the given class. Infinity indicates that the character doesn't need to prepare spells. Null is returned when the character has no spells.
 */
function getPreparedSpellsNumber(attributes, className, subclass, level) {
	const castingAttributeValue = attributes[getSpellcastingAttributeAbbreviation(className, subclass)];
	const castingModifier = getAbilityModifier(castingAttributeValue);

	if (['Bard', 'Ranger', 'Sorcerer (Prophetus)', 'Warlock (Vilos)'].includes(className) || ['Eldritch Knight', 'Arcane Trickster', 'Shadow'].includes(subclass)) {
		return Infinity;
	}
	else if (['Cleric', 'Druid', 'Wizard (Incantator)'].includes(className)) {
		return level + castingModifier;
	}
	else if (['Artificer', 'Paladin'].includes(className) || ['Vow of Divinity'].includes(subclass)) {
		return Math.max(1, Math.floor(level / 2)) + castingModifier;
	}
	else {
		return null;
	}
}

/**
 * Determines the highest spell order known to the character as part of the
 *  given class.
 * @param {String} className
 * @param {String} subclass
 * @param {Number} level - Level in that specific class.
 * @returns {?Number} The highest spell order known to the character. Null indicates that the character has no spellcasting.
 */
function getMaxKnownOrder(className, subclass, level) {
	if (['Bard', 'Cleric', 'Druid', 'Sorcerer (Prophetus)', 'Wizard (Incantator)'].includes(className)) {
		return Math.min(9, Math.ceil(level / 2));
	}
	else if (['Warlock (Vilos)'].includes(className)) {
		return Math.min(5, Math.ceil(level / 2));
	}
	else if (['Artificer'].includes(className)) {
		return Math.min(5, Math.ceil(level / 4));
	}
	else if (['Paladin', 'Ranger'].includes(className)) {
		return (level < 2 ? null : Math.min(5, Math.ceil(level / 4)));
	}
	else if (['Vow of Divinity'].includes(subclass)) {
		return (level < 3 ? null : Math.min(4, 1 + Math.floor(level / 6)));
	}
	else if (['Eldritch Knight', 'Arcane Trickster', 'Shadow'].includes(subclass)) {
		return (level < 3 ? null : Math.min(4, Math.ceil(level / 6)));
	}
	else {
		return null;
	}
}

/**
 * Determines the number of cantrips known by the character as part of the
 *  given class.
 * @param {String} className
 * @param {String} subclass
 * @param {Number} level - Level in that specific class.
 * @returns {?Number} The number of cantrips known to the character. Null indicates that the character has no cantrips.
 */
function getKnownCantripsNumber(className, subclass, level) {
	if (['Sorcerer (Prophetus)'].includes(className)) {
		return Math.min(6, 3 + Math.ceil((level + 3) / 6));
	}
	else if (['Cleric', 'Wizard (Incantator)'].includes(className)) {
		return Math.min(5, 2 + Math.ceil((level + 3) / 6));
	}
	else if (['Artificer', 'Bard', 'Druid'].includes(className)) {
		return Math.min(4, 1 + Math.ceil((level + 3) / 6));
	}
	else if (['Warlock (Vilos)'].includes(className)) {
		return Math.min(4, 1 + Math.ceil((level + 2) / 5));
	}
	else if (['Eldritch Knight', 'Arcane Trickster', 'Shadow', 'Vow of Divinity'].includes(subclass)) {
		return (level < 3 ? null : Math.min(3, 2 + Math.floor(level / 10)));
	}
	else {
		return null;
	}
}

/**
 * @typedef {Object} SpellsKnownSection
 * @property {?String} description - The description of what is unique about this section of spells known, such as "only from school X and Y", or "from any class".
 * @property {Object.<Number, ?Number>} spellsKnown - Number of spells known, indexed by spell order. Null/undefined means that the charcater does not know that spell order. Infinity means that the character knows all the spells from that order. Zeroth order is used for cantrips, where null means that the character has no cantrips.
 */

/**
 * Sums two objects of spells known values, keyed by spell order.
 * @param {Object.<Number, ?Number>} a
 * @param {Object.<Number, ?Number>} b
 * @returns {Object.<Number, ?Number>}
 */
function sumSpellsKnownObjects(a, b) {
	const result = {};
	const minOrder = Math.min(...Object.keys(a), ...Object.keys(b));
	const maxOrder = Math.max(...Object.keys(a), ...Object.keys(b));

	for (let i = 0; i <= maxOrder; i++) {
		if (i === 0 && i < minOrder) {
			result[i] = null;
		} else {
			result[i] = (a[i] || 0) + (b[i] || 0);
		}
	}

	return result;
}

/**
 * Determines how many spells a character knows as member of this class on the
 *  given level.
 * An array of SpellsKnownSection objects is returned.
 *
 * Null is returned instead of the whole object if the character has no spellcasting at all.
 * @see SpellsKnownSection
 * @param {Object} attributes
 * @param {String} className
 * @param {String} subclass
 * @param {Number} level - Level in that specific class.
 * @param {Number} [startingLevel=0] - The level from which to begin. Useful for finding delta tables.
 * @param {Boolean} [replaceWhenPossible=true] - Whether to replace low level spells when possible. Useful for finding delta tables, where replacement should possibly be output separately, due to someone acquiring multiple levels at once.
 * @returns {?Array.<SpellsKnownSection>} An array of SpellsKnownSection objects.
 */
function getKnownSpellsTable(className, subclass, level, startingLevel=0, replaceWhenPossible=true) {
	// Level guard clause - Paladins and Rangers get spellcasting at level 2,
	//  Vow of Divinity Flagellants and other 'third' subclass casters - at level 3
	if (
		(['Paladin', 'Ranger'].includes(className) && level < 2) ||
		(['Eldritch Knight', 'Arcane Trickster', 'Shadow', 'Vow of Divinity'].includes(subclass) && level < 3)
	) {
		return null;
	}

	if (level <= startingLevel) {
		throwError('Target level must be greater than starting level');
	}

	let result = [];
	let baseSection = {
		description: CLASS_BASE_SPELLS_KNOWN_DESCRIPTORS[className],
		spellsKnown: {}
	};

	// Handle cantrips first
	let cantripsKnown = getKnownCantripsNumber(className, subclass, level);
	if (startingLevel) {
		cantripsKnown -= getKnownCantripsNumber(className, subclass, startingLevel);
	}

	baseSection.spellsKnown[0] = cantripsKnown;

	// Now onto remaining spell orders - handle the most regular spells first
	const maxKnownOrder = getMaxKnownOrder(className, subclass, level);

	if (['Artificer', 'Cleric', 'Druid', 'Paladin'].includes(className) || ['Vow of Divinity'].includes(subclass)) {
		// Some classes know all the spells of their known orders
		for (let order = 1; order <= maxKnownOrder; order++) {
			baseSection.spellsKnown[order] = Infinity;
		}

		if (subclass === 'Vow of Divinity') {
			baseSection.description = VOW_OF_DIVINITY_SPELLS_KNOWN_DESCRIPTOR;
		}
	}
	else if (['Wizard (Incantator)'].includes(className)) {
		// Wizards use spellbooks and they cannot replace spells

		// Go through all levels and keep adding spells accordingly
		for (let i = startingLevel + 1; i <= level; i++) {
			if (i === 1) {
				baseSection.spellsKnown[1] = 6;
			} else {
				const order = getMaxKnownOrder(className, subclass, i);
				if (!baseSection.spellsKnown[order]) {
					baseSection.spellsKnown[order] = 2;
				} else {
					baseSection.spellsKnown[order] += 2;
				}
			}
		}
	}
	else if (['Bard', 'Sorcerer (Prophetus)', 'Warlock (Vilos)'].includes(className)) {
		// Bards get 4, Propheti and Vilosi get 2
		const startingSpells = (className === 'Bard' ? 4 : 2);
		// At some point the progression starts changing from one spell per level,
		//  namely when the spell count would reach 12.
		const changeThresholdLevel = 13 - startingSpells;

		// Go through all levels and keep adding and replacing spells accordingly
		for (let i = startingLevel + 1; i <= level; i++) {
			if (i === 1) {
				baseSection.spellsKnown[1] = startingSpells;
			}
			else {
				const order = getMaxKnownOrder(className, subclass, i);
				// Find lowest possible order for spell replacement
				let lowestOrder = null;
				for (let j = 1; j < order; j++) {
					if (baseSection.spellsKnown[j] >= 1) {
						lowestOrder = j;
						break;
					}
				}

				// Grant new spells
				if (i <= changeThresholdLevel || (i % 2 === 1 && i <= 17)) {
					if (!baseSection.spellsKnown[order]) {
						baseSection.spellsKnown[order] = 1;
					} else {
						baseSection.spellsKnown[order] += 1;
					}
				}

				// Replace a spell if it's possible
				if (replaceWhenPossible && lowestOrder) {
					baseSection.spellsKnown[lowestOrder] -= 1;
					baseSection.spellsKnown[order] += 1;
				}
			}
		}
	} else if (['Ranger'].includes(className)) {
		// Attention: They get this at level 2, not level 1!
		const startingSpells = 2;

		// Go through all levels and keep adding and replacing spells accordingly
		for (let i = Math.max(2, startingLevel + 1); i <= level; i++) {
			if (i === 2) {
				baseSection.spellsKnown[1] = startingSpells;
			} else {
				const order = getMaxKnownOrder(className, subclass, i);
				// Find lowest possible order for spell replacement
				let lowestOrder = null;
				for (let j = 1; j < order; j++) {
					if (baseSection.spellsKnown[j] >= 1) {
						lowestOrder = j;
						break;
					}
				}

				// Grant new spells
				if (i % 2 === 1) {
					if (!baseSection.spellsKnown[order]) {
						baseSection.spellsKnown[order] = 1;
					} else {
						baseSection.spellsKnown[order] += 1;
					}
				}

				// Replace a spell if it's possible
				if (replaceWhenPossible && lowestOrder) {
					baseSection.spellsKnown[lowestOrder] -= 1;
					baseSection.spellsKnown[order] += 1;
				}
			}
		}
	} else if (['Eldritch Knight', 'Arcane Trickster', 'Shadow'].includes(subclass)) {
		// Go through all levels and keep adding and replacing spells accordingly
		for (let i = Math.max(3, startingLevel + 1); i <= level; i++) {
			const order = getMaxKnownOrder(className, subclass, i);

			if (!baseSection.spellsKnown[order]) {
				baseSection.spellsKnown[order] = 0;
			}

			// Only do the unrestricted spells
			if ([8, 14, 20].includes(i)) {
				baseSection.spellsKnown[order] += 1;
			}
		}

		baseSection.description = THIRD_CASTER_UNRESTRICTED_SPELLS_KNOWN_DESCRIPTOR;
	}

	// This is the best point to handle some of the extra features, such as Warlock's
	//  Mystic Arcana, that can possibly interact with the base spellcasting.

	// Warlock's Mystic Arcana
	if (className === 'Warlock (Vilos)') {
		// Go through all levels
		for (let i = startingLevel + 1; i <= level; i++) {
			// This formula holds for these 4 levels of 11, 13, 15 and 17, which is enough in this case
			const order = Math.min(9, Math.round((i + 1) / 2));
			if ([11, 13, 15, 17].includes(i)) {
				if (!baseSection.spellsKnown[order]) {
					baseSection.spellsKnown[order] = 1;
				} else {
					baseSection.spellsKnown[order] += 1;
				}
			}
		}
	}

	// Third casters' restricted spells
	if (['Eldritch Knight', 'Arcane Trickster', 'Shadow'].includes(subclass)) {
		const restrictedSection = {
			description: THIRD_CASTER_RESTRICTED_SPELLS_KNOWN_DESCRIPTORS[subclass],
			spellsKnown: {}
		};

		// Attention: They get those at level 3, not level 1!
		const startingSpells = 3;

		// Go through all levels and keep adding and replacing spells accordingly
		for (let i = Math.max(3, startingLevel + 1); i <= level; i++) {
			if (i === 3) {
				restrictedSection.spellsKnown[1] = startingSpells;
			}
			else {
				const order = getMaxKnownOrder(className, subclass, i);
				// Find lowest possible order for spell replacement, treating restricted
				//  spell separately.
				let lowestAnyOrder = null;
				let lowestRestrictedOrder = null;
				for (let j = 1; j < order; j++) {
					if (baseSection.spellsKnown[j] >= 1) {
						lowestAnyOrder = j;
						break;
					}
				}
				for (let j = 1; j < order; j++) {
					if (restrictedSection.spellsKnown[j] >= 1) {
						lowestRestrictedOrder = j;
						break;
					}
				}

				if (!restrictedSection.spellsKnown[order]) {
					restrictedSection.spellsKnown[order] = 0;
				}

				// Only do the restircted spells this time
				if ([3, 4, 7, 10, 11, 13, 16, 19].includes(i)) {
					restrictedSection.spellsKnown[order] += 1;
				}

				// Replace a spell if it's possible, but prioritize unrestricted spells
				if (replaceWhenPossible && lowestAnyOrder) {
					baseSection.spellsKnown[lowestAnyOrder] -= 1;
					baseSection.spellsKnown[order] += 1;
				}
				else if (replaceWhenPossible && lowestRestrictedOrder) {
					restrictedSection.spellsKnown[lowestRestrictedOrder] -= 1;
					restrictedSection.spellsKnown[order] += 1;
				}
			}
		}

		result.push(restrictedSection);
	}

	// Include the base in the result
	result.push(baseSection);

	// Now, handle extra-extra gimmicks

	// Bard's Magical Secrets
	if (className === 'Bard') {
		const magicalSecretsSection = {
			description: 'spells from any class',
			spellsKnown: {}
		};

		for (let order = 1; order <= maxKnownOrder; order++) {
			magicalSecretsSection.spellsKnown[order] = 0;
		}

		// Go through all levels
		for (let i = startingLevel + 1; i <= level; i++) {
			const order = getMaxKnownOrder(className, subclass, i);
			if ((i === 6 && subclass === 'College of Lore') || [10, 14, 18].includes(i)) {
				magicalSecretsSection.spellsKnown[order] += 2;
			}
		}

		if (Object.keys(magicalSecretsSection.spellsKnown).length) {
			result.push(magicalSecretsSection);
		}
	}

	// Warlock's Transcendent Arcanum
	if (className === 'Warlock (Vilos)' && level === 20) {
		const transcendentArcanumSection = {
			description: 'Transcendent Arcanum spells from any class',
			spellsKnown: {
				9: 1
			}
		};

		result.push(transcendentArcanumSection);
	}

	// Thank God, this function ends now
	return result;
}

/**
 * Determines whether a class is a caster class at the given level or not.
 * @param {String} className
 * @param {String} subclass
 * @param {Number} level - Level in that specific class.
 * @returns {Boolean}
 */
function getIsCasterClass(className, subclass, level) {
	if (['Artificer', 'Bard', 'Cleric', 'Druid', 'Sorcerer (Prophetus)', 'Warlock (Vilos)', 'Wizard (Incantator)'].includes(className) && level >= 1) {
		return true;
	}
	else if (['Paladin', 'Ranger'].includes(className) && level >= 2) {
		return true;
	}
	else if (['Eldritch Knight', 'Arcane Trickster', 'Shadow', 'Vow of Divinity'].includes(subclass) && level >= 3) {
		return true;
	}
	else {
		return false;
	}
}

/**
 * @typedef {Object} PlayerClass
 * @property {String} className
 * @property {String} subclass
 * @property {Number} level - Level in that specific class.
 */

/**
 * @typedef {Object} ResourceDescriptor
 * @property {String} description
 * @property {Array.<Number>} slots - The number of slots of the given order, indexed by said order.
 */

/**
 * Determines how many spell slots and other spellcasting resources the character
 *  has from a *single* class.
 * An array of ResourceDescriptor objects is returned.
 * Empty array is returned if the character has no spellcasting at all.
 * This function DOES NOT check for level conditions, such as Paladin needing
 *  2nd level to cast spells.
 * @see ResourceDescriptor
 * @param {String} className
 * @param {String} subclass
 * @param {Number} level - Level in that specific class.
 * @returns {Array.<ResourceDescriptor>} An array of ResourceDescriptor objects.
 */
function _getSpellcastingResourceTableForClass(className, subclass, level) {
	let result = [];

	if (['Bard', 'Cleric', 'Druid', 'Sorcerer (Prophetus)', 'Wizard (Incantator)'].includes(className)) {
		result.push({
			description: className + ' spell slots',
			slots: SPELL_SLOT_PROGRESSION[level]
		});
	} else if (['Artificer', 'Paladin', 'Ranger'].includes(className)) {
		// This just so happens to scale like it does for multiclassing, except
		//  it's ceiling instead of floor. Same for the third casters.
		result.push({
			description: className + ' spell slots',
			slots: SPELL_SLOT_PROGRESSION[Math.ceil(level / 2)]
		});
	} else if (['Eldritch Knight', 'Arcane Trickster', 'Shadow'].includes(subclass)) {
		result.push({
			description: subclass + ' spell slots',
			slots: SPELL_SLOT_PROGRESSION[Math.ceil(level / 3)]
		});
	} else if (['Warlock (Vilos)'].includes(className)) {
		let pactMagicSlotsNumber;
		if (level === 1) {
			pactMagicSlotsNumber = 1;
		} else if (level <= 10) {
			pactMagicSlotsNumber = 2;
		} else if (level <= 16) {
			pactMagicSlotsNumber = 3;
		} else {
			pactMagicSlotsNumber = 4;
		}
		const pactMagicOrder = getMaxKnownOrder(className, subclass, level);

		// The number of zeros is equal to the order at which there *should* be
		//  spell slots, because one of the zeros stands in for the zeroth
		//  order representing cantrips.
		let pactMagicSlots = fillArray(0, pactMagicOrder);
		pactMagicSlots.push(pactMagicSlotsNumber);
		// For consistency with the main spell slot progression, null for cantrips
		pactMagicSlots[0] = null;

		result.push({
			description: 'Pact Magic spell slots',
			slots: pactMagicSlots,
		});

		// Mystic Arcana only ever start appearing starting level 11.
		if (level >= 11) {
			let mysticArcanaSlots = fillArray(0, 5);
			mysticArcanaSlots[0] = null;

			// No else-if here is correct - those are thresholds and multiple
			//  cases are supposed to fire off.
			// Yes, that one condition is written twice. That's for clarity's sake, due to
			//  how each of those two serves a different purpose. The first one gates
			//  the mystic arcana as a whole. The second one is one of many thresholds.
			if (level >= 11) {
				mysticArcanaSlots.push(1);
			}
			if (level >= 13) {
				mysticArcanaSlots.push(1);
			}
			if (level >= 15) {
				mysticArcanaSlots.push(1);
			}
			if (level >= 17) {
				mysticArcanaSlots.push(1);
			}

			result.push({
				description: 'Mystic Arcana spell slots',
				slots: mysticArcanaSlots
			});
		}

		// Transcendent Arcanum
		if (level === 20) {
			let transArcanumSlots = fillArray(0, 10);
			transArcanumSlots[0] = null;
			transArcanumSlots.push(1);

			result.push({
				description: 'Transcendent Arcanum spell slots',
				slots: transArcanumSlots
			});
		}
	} else if (['Vow of Divinity'].includes(subclass)) {
		// This is far too unique to handle in a smart-ass pro-gamer way
		result.push({
			description: subclass + ' spell slots',
			slots: VOW_OF_DIVINITY_SPELL_SLOT_PROGRESSION[level]
		});
	}

	return result;
}

/**
 * Determines how many spell slots and other spellcasting resources the character
 *  has, based on the given multiple classes, subclasses and levels.
 * An array of ResourceDescriptor objects is returned.
 * Null is returned instead of the whole object if the character has no spellcasting at all.
 * This function *does* check for level conditions such as Paladins needing
 *  2nd level to cast spells.
 * @see PlayerClass
 * @see ResourceDescriptor
 * @param {Array.<PlayerClass>} playerClasses - An array of PlayerClass objects.
 * @param {?Object} [metadataReference=null] - If given, metadata will be inserted into that object.
 * @returns {?Array.<ResourceDescriptor>} An array of ResourceDescriptor objects.
 */
function getSpellcastingResourcesTableForClasses(playerClasses, metadataReference=null) {
	// Filter out non-caster classes. The getIsCasterClass() function already gets
	//  rid of stuff like Paladin and Ranger below 2nd level.
	const playerCasterClasses = playerClasses.filter((cl) => getIsCasterClass(cl.className, cl.subclass, cl.level));
	let result = [];

	if (metadataReference) {
		metadataReference.case = null;
		metadataReference.casterClasses = playerCasterClasses;
	}

	// Count unique cases to use for conditions down below. Namely, we don't want
	//  to use multiclassing rules if either Vow of Divinity or Warlock (or both)
	//  are used, while there is no more than one other casting class beyond those
	//  two.
	// Preserve indices in case there are four classes or more and those unique
	//  cases need to be singled out, while the others need to be grouped together.
	let uniqueCases = 0;
	const warlockIdx = playerCasterClasses.findIndex((cl) => cl.className === 'Warlock (Vilos)');
	const vowOfDivinityIdx = playerCasterClasses.findIndex((cl) => cl.subclass === 'Vow of Divinity');
	if (warlockIdx !== -1) {
		uniqueCases += 1;
	}
	if (vowOfDivinityIdx !== -1) {
		uniqueCases += 1;
	}

	if (playerCasterClasses.length === 1) {
		// Single class case
		if (metadataReference) {
			metadataReference.case = 1;
		}

		const className = playerCasterClasses[0].className;
		const subclass = playerCasterClasses[0].subclass;
		const level = playerCasterClasses[0].level;

		return _getSpellcastingResourceTableForClass(className, subclass, level);
	}
	else if (playerCasterClasses.length > 1 && (playerCasterClasses.length - uniqueCases <= 1)) {
		// Unique cases are classes separate from the multiclassing rules that
		//  bundle all the classes together. If those occur, do not use multiclassing
		//  rules if there is not more than one class beyond the unique ones.
		if (metadataReference) {
			metadataReference.case = 2;
		}

		// Simply handle all of those cases individually.
		playerCasterClasses.forEach(function(playerClass) {
			const classResources = _getSpellcastingResourceTableForClass(playerClass.className, playerClass.subclass, playerClass.level);
			classResources.forEach(function(resource) {
				result.push(resource);
			});
		});
	}
	else if (playerCasterClasses.length > 1) {
		// This is regular multiclassing right now.
		if (metadataReference) {
			metadataReference.case = 3;
		}

		let multiclassCasterLevel = 0;

		// Go through all the classes by index. The index is useful for comparison
		//  against the unique case indices found previously.
		for (let i = 0; i < playerCasterClasses.length; i++) {
			const playerClass = playerCasterClasses[i];

			// Handle unique cases as individual ones
			if (i === warlockIdx || i === vowOfDivinityIdx) {
				const classResources = _getSpellcastingResourceTableForClass(playerClass.className, playerClass.subclass, playerClass.level);
				classResources.forEach(function(resource) {
					result.push(resource);
				});
			}
			else {
				// Sum levels for non-unique cases
				multiclassCasterLevel += getMulticlassCasterLevelContribution(playerClass.className, playerClass.subclass, playerClass.level);
			}
		}

		// All non-unique multiclass spell slots become one type.
		result.push({
			description: 'multiclass spell slots',
			slots: SPELL_SLOT_PROGRESSION[multiclassCasterLevel]
		});
	}

	return result;
}

// ### Script ###

// Load navigation file
const navFileRaw = loadFile(NAV_FILE_PATH);
if (navFileRaw) {
	// Just some regexen to single out the desired data between specific series of characters
	// The first element in each of those resulting arrays is the regex group that
	//  includes the matching content, but drops the "bounding strings" with
	//  respect to which the search was done.
	const coreClassesRaw = navFileRaw.match(/\* # Core classes([\s\S]*?)- - - -/)[1].trim();
	const extraClassesRaw = navFileRaw.match(/\* # Additional classes([\s\S]*?)\[Races\]\(\)/)[1].trim();
	const allClassesRaw = coreClassesRaw + '\n' + extraClassesRaw;
	const allClassesRawLines = allClassesRaw.split('\n').map((line) => line.trim());
	g_classNames = allClassesRawLines.map(function (line) {
		// Determine the class name first
		const className = line.match(/\* \[([\s\S]*?)\]\(/)[1].trim();

		// Declare object at such key in g_classData object
		g_classData[className] = {
			subclassNames: []
		};

		// Isolate the path to the class .md file and read it to get some extra data
		const classFileRelPath = line.match(/\]\(([\s\S]*?)\)/)[1].trim();
		const classFilePath = URL_BASE + '/' + classFileRelPath;
		const classFileRaw = loadFile(classFilePath);

		if (classFileRaw) {
			// Regexen to find what we want
			let subclassesRaw = classFileRaw.match(/## List of ([\s\S]*?)---/)[0].trim();
			subclassesRaw = subclassesRaw.match(/\* \*\*([\s\S]*?)---/)[0].trim();
			const subclassesRawLines = subclassesRaw.split('\n').map((line) => line.trim());

			subclassesRawLines.forEach(function(line) {
				// Don't include empty lines or "---" lines, there might be some
				if (line && line !== "---") {
					const subclassName = line.match(/\* \*\*([\s\S]*?):\*\*/)[1].trim();
					g_classData[className].subclassNames.push(subclassName);
				}
			});
		} else {
			throwError('Failed to load ' + classFilePath);
		}

		return className;
	});
} else {
	throwError('Failed to load ' + NAV_FILE_PATH);
}

$(document).ready(function() {
	// Update all class lists with acquired class names
	const classNamesOptionsHtml = g_classNames.map(function (className) {
		return '<option>' + className + '</option>';
	}).join('\n');
	$('.class-selection').append(classNamesOptionsHtml);

	// Define event for changing attribute values
	$('.attribute-input').change(function() {
		// Get shorthand for the attribute being changed
		const attribute = $(this).attr('attributeName');

		// Store attribute in the global object
		g_attributes[attribute] = $(this).val();
	});

	// Define event for updating the subclass list when a class is picked from the dropdown
	$('.class-selection').change(function() {
		// Get the name of the newly selected class
		const className = $(this).val();

		// Acquire subclass names
		const subclassNames = (g_classData[className] || {}).subclassNames || [''];

		// Get reference to the subclass dropdown corresponding to the current class dropdown
		// Note how this event is being defined generally, by class, not by ID.
		const subclassInputId = $(this).attr('subclassInputId');
		const subclassInputJQuery = '#' + subclassInputId;

		const subclassNamesOptionsHtml = subclassNames.map(function (subclassName) {
			return '<option>' + subclassName + '</option>';
		}).join('\n');

		// We want to wipe the old subclasses from the class that had currently been selected,
		//  thus .html(), not .append(), is being used.
		$(subclassInputJQuery).html(subclassNamesOptionsHtml);

		// Now that there are multiple options, also mark the first option as selected subclass
		const classIdx = $(this).attr('classIdx');
		g_playerClasses[classIdx].subclass = subclassNames[0];
	});

	// Define events for updating the global object when player class is being changed
	$('.class-selection').change(function() {
		// Get the name of the newly selected class
		const className = $(this).val();

		// Acquire class index
		const classIdx = $(this).attr('classIdx');

		// Change at the given index
		g_playerClasses[classIdx].className = className;
	});
	$('.subclass-selection').change(function() {
		// Get the name of the newly selected subclass
		const subclass = $(this).val();

		// Acquire class index
		const classIdx = $(this).attr('classIdx');

		// Change at the given index
		g_playerClasses[classIdx].subclass = subclass;
	});
	$('.class-level-input').change(function() {
		// Get the name of the newly selected subclass
		const level = parseInt($(this).val());

		// Acquire class index
		const classIdx = $(this).attr('classIdx');

		// Change at the given index
		g_playerClasses[classIdx].level = level;
	});

	// Preserve original results section html to restore it later for a nice
	//  and quick reset.
	g_resultsSectionOriginalHtml = $('#resultsSection').html();

	// Finally do stuff when the button is pressed
	$('#submitButton').click(function() {
		try {
			// Get checkbox values to see what to do
			const requestedSpellcasting = $('#spellcastingCheckbox').is(':checked');

			// End the function if nothing at all was selected
			if (!requestedSpellcasting) {
				alert('You gotta check something, though');
				return;
			}

			const totalLevel = g_playerClasses.map((cl) => cl.level).reduce((a, b) => (b ? a + b : a)) || 0;

			// TODO: Implement epic levels
			if (totalLevel > 20) {
				alert('Ain\'t no epic levels yet, pal, sorry for that');
				return;
			}

			// Handle the spellcasting info request
			if (requestedSpellcasting) {
				const metadata = {};
				const castingResources = getSpellcastingResourcesTableForClasses(g_playerClasses, metadata);
				if (!(castingResources || []).length) {
					// Empty result
					alert('Dafuq you mean "spellcasting"? You ain\'t got no caster levels!')
					return;
				}
				const castingClasses = (metadata.casterClasses || []);

				// Make sure there are enough casting attributes given

				// First, create a record of all the attributes that should be given
				const requiredAttributes = {};
				castingClasses.forEach(function(castingClass) {
					const castingAttr = getSpellcastingAttributeAbbreviation(castingClass.className, castingClass.subclass);
					if (castingAttr) {
						castingClass.castingAttr = castingAttr; // This is for later use, so that the attribute doesn't have to be found twice
						requiredAttributes[castingAttr] = true;
					}
				});

				// Then see which attributes *are* actually given
				Object.keys(g_attributes).forEach(function(attr) {
					if (g_attributes[attr]) {
						requiredAttributes[attr] = false;
					}
				});

				// The attributes that are marked as 'true' are still required and haven't
				//  been provided, therefore inform the user about this.
				const missingAttributes = Object.keys(requiredAttributes).filter((attr) => requiredAttributes[attr]);

				if (missingAttributes.length) {
					const missingAttributeNames = missingAttributes.map((attr) => ATTRIBUTE_FULL_NAMES[attr]);

					// Highlight the inputs
					missingAttributeNames.forEach(function(attributeName) {
						$('#input' + attributeName).addClass('is-invalid');
						$('#input' + attributeName).one('click', function() {
							$(this).removeClass('is-invalid');
						});
					});

					// Display the message
					if (missingAttributeNames.length === 1) {
						alert('Bro. Why you hidin\' dat ' + missingAttributeNames[0] + ' score from me like that? I need it for quick maths.');
					}
					else if (missingAttributeNames.length >= 2) {
						missingAttributeNames[missingAttributeNames.length - 2] = missingAttributeNames[missingAttributeNames.length - 2] + ' and ' + missingAttributeNames.pop();
						alert('Bro. Why you hidin\' dem ' + missingAttributeNames.join(', ') + ' scores from me like that? I need them for quick maths.');
					}

					// End the function for now, because the process was interrupted
					return;
				}

				// All data was given, so now a bunch of stuff can be found

				// We want to sum casting spells known entries of the same description.
				// In order to achieve that, the data will have to be unflattened.
				// The castingSpellsKnown object will contain .spellsKnown value arrays,
				//  keyed by .description.
				let castingSpellsKnown = {};
				castingClasses.forEach(function(castingClass) {
					castingClass.castingAttrValue = g_attributes[castingClass.castingAttr];
					castingClass.castingAttrMod = getAbilityModifier(castingClass.castingAttrValue);
					castingClass.spellDC = getSpellDC(castingClass.castingAttrMod, totalLevel);
					castingClass.spellAttackMod = getSpellAttackModifier(castingClass.castingAttrMod, totalLevel);
					castingClass.spellsPrepared = getPreparedSpellsNumber(g_attributes, castingClass.className, castingClass.subclass, castingClass.level);
					getKnownSpellsTable(castingClass.className, castingClass.subclass, castingClass.level).forEach(function(spellsKnownEntry) {
						if (!castingSpellsKnown[spellsKnownEntry.description]) {
							castingSpellsKnown[spellsKnownEntry.description] = spellsKnownEntry.spellsKnown;
						} else {
							castingSpellsKnown[spellsKnownEntry.description] = sumSpellsKnownObjects(castingSpellsKnown[spellsKnownEntry.description], spellsKnownEntry.spellsKnown);
						}
					});
				});

				// Similarly unflatten spell slots
				let castingResourcesObjects = {};
				castingResources.forEach(function(resource) {
					// Those initially come in arrays, so convert to object now.
					const slotsObj = Object.assign({}, resource.slots);
					if (!castingResourcesObjects[resource.description]) {
						castingResourcesObjects[resource.description] = slotsObj;
					} else {
						castingResourcesObjects[resource.description] = sumSpellsKnownObjects(castingResourcesObjects[resource.description], slotsObj);
					}
				});

				/*
				console.log('Found data:');
				console.log(castingClasses);
				console.log(castingSpellsKnown);
				console.log(castingResourcesObjects);
				*/

				// Finally, present the data to the user
				$('#resultsSection').html(g_resultsSectionOriginalHtml);
				$('#resultsSection').show();

				// Substitute placeholders
				const htmlPlaceholderPrefix = '.ph-';

				// Classes

				// Generic placeholders
				for (let i = 0; i < Math.min(CLASSES_MAX_NUMBER, castingClasses.length); i++) {
					const castingClass = castingClasses[i];
					const htmlClassPrefix = '.ph-class' + (i + 1) + '-';

					$(htmlClassPrefix + 'name').html(castingClass.className);
					$(htmlClassPrefix + 'level').html(castingClass.level);
					$(htmlClassPrefix + 'casting-ability-name').html(ATTRIBUTE_FULL_NAMES[castingClass.castingAttr]);
					$(htmlClassPrefix + 'spelldc').html(castingClass.spellDC);
					$(htmlClassPrefix + 'spell-attack-mod').html(applyModifierNotation(castingClass.spellAttackMod));
					if(castingClass.spellsPrepared === Infinity) {
						$(htmlClassPrefix + 'prepares-spells').hide();
					} else {
						$(htmlClassPrefix + 'spells-prepared-number').html(castingClass.spellsPrepared);
						$(htmlClassPrefix + 'does-not-prepare').hide();
					}
					$(htmlClassPrefix + 'spells-prepared-descr').html(getCasterClassOrSubclassName(castingClass.className, castingClass.subclass) + ' spells');
				}

				// Single-class case
				if (castingClasses.length === 1) {
					// Only hide all that relates to multiclassing. Generic placeholders
					//  have handled everything already.
					$('.multi-caster-class').hide();
				}
				else if (castingClasses.length >= 2) {
					// Here we fucking go...

					// Hide all single class entries
					$('.single-caster-class').hide();

					// Acquire the list item template that will describe a class entry
					const classListItemTemplate = $('#castingClassListItemTemplate').html();
					$('#castingClassListItemTemplate').hide();

					for (let i = 0; i < castingClasses.length; i++) {
						const classItemSpanId = 'castingClass' + (i + 1);
						const jquerySelectorPrefix = '#' + classItemSpanId + ' ' + htmlPlaceholderPrefix;

						const castingClass = castingClasses[i];

						// First, create a span that will wrap around the template
						$('#castingClassesList').append('<span id="' + classItemSpanId + '"></span>');

						// Instantiate the template itself inside the span
						$('#' + classItemSpanId).html(classListItemTemplate);

						// Fill the instantiated template
						$(jquerySelectorPrefix + 'class-name').html(castingClass.className);
						$(jquerySelectorPrefix + 'class-subclass').html(castingClass.subclass);
						$(jquerySelectorPrefix + 'class-level').html(castingClass.level);
						$(jquerySelectorPrefix + 'class-casting-ability-name').html(ATTRIBUTE_FULL_NAMES[castingClass.castingAttr]);
						$(jquerySelectorPrefix + 'class-spelldc').html(castingClass.spellDC);
						$(jquerySelectorPrefix + 'class-spell-attack-mod').html(applyModifierNotation(castingClass.spellAttackMod));
						if(castingClass.spellsPrepared === Infinity) {
							$(jquerySelectorPrefix + 'class-prepares-spells').hide();
						} else {
							$(jquerySelectorPrefix + 'class-spells-prepared-number').html(castingClass.spellsPrepared);
							$(jquerySelectorPrefix + 'class-does-not-prepare').hide();
						}
						$(jquerySelectorPrefix + 'class-casting-descr').html(getCasterClassOrSubclassName(castingClass.className, castingClass.subclass));
					}
				}

				// Spells known

				// Acquire the templates first
				const spellListCantripItemHtml = $('#spellsKnownListItemCantripTemplate').html();
				$('#spellsKnownListItemCantripTemplate').hide();
				const spellListSpellItemHtml = $('#spellsKnownListItemSpellTemplate').html();
				$('#spellsKnownListItemSpellTemplate').hide();

				// Group by *orders* first rather than descriptions
				for (let order = 0; order <= MAX_ORDER; order++) {
					const castingSpellsKnownDescriptions = Object.keys(castingSpellsKnown);
					for (let i = 0; i < castingSpellsKnownDescriptions.length; i++) {
						const description = castingSpellsKnownDescriptions[i];
						const spellsKnown = castingSpellsKnown[description];
						if (spellsKnown[order]) {
							const listItemSpanId = 'spellsKnown' + (i + 1) + 'Order' + order;
							const jquerySelectorPrefix = '#' + listItemSpanId + ' ' + htmlPlaceholderPrefix;

							// First, create a span that will wrap around the template
							$('#spellsKnownList').append('<span id="' + listItemSpanId + '"></span>');
							// Soft comparison used on purpose, this might be a string or a number.
							// Who knows at this point.
							if (order == 0) {
								// Instantiate the template itself inside the span
								$('#' + listItemSpanId).html(spellListCantripItemHtml);

								let cantripDescription = description.replace('spells', (spellsKnown[order] === 1 ? 'Cantrip' : 'Cantrips'));
								cantripDescription = cantripDescription.match(/([\s\S]*?)Cantrips/)[0];

								// Fill the instantiated template
								$(jquerySelectorPrefix + 'cantrips-known-number').html((spellsKnown[order] === Infinity ? 'All' : spellsKnown[order]));
								$(jquerySelectorPrefix + 'cantrips-known-descr').html(cantripDescription);
							} else {
								// Instantiate the template itself inside the span
								$('#' + listItemSpanId).html(spellListSpellItemHtml);

								let spellDescription = (spellsKnown[order] === 1 ? description.replace('spells', 'spell') : description);

								// Fill the instantiated template
								$(jquerySelectorPrefix + 'spells-known-number').html((spellsKnown[order] === Infinity ? 'All' : spellsKnown[order]));
								$(jquerySelectorPrefix + 'spells-known-descr').html(spellDescription);
								$(jquerySelectorPrefix + 'spells-known-max-order').html(romanize(order));
								if (spellsKnown[order] === Infinity) {
									$(jquerySelectorPrefix + 'spells-known-order-relation').html('');
								}
							}
						}
					}
				}

				// Spell resources

				// Acquire the template first
				const slotTableHtml = $('#spellSlotsTableTemplate').html();
				$('#spellSlotsTableTemplate').hide();
				for (let i = 0; i < Object.keys(castingResourcesObjects).length; i++) {
					const description = Object.keys(castingResourcesObjects)[i];
					const slotsObj = castingResourcesObjects[description];

					const tableSpanId = 'spellSlotsTable' + (i + 1);
					const jquerySelectorPrefix = '#' + tableSpanId + ' ' + htmlPlaceholderPrefix;

					// First, create a span that will wrap around the template
					$('#resultsSpellcastingList').append('<span id="' + tableSpanId + '"></span>');
					// Instantiate the template
					$('#' + tableSpanId).html(slotTableHtml);

					// Insert spell slot description
					$(jquerySelectorPrefix + 'spellslot-descr').html(description);

					// Fill the table
					const spellSlotOrders = Object.keys(slotsObj);
					spellSlotOrders.forEach(function(order) {
						// Soft comparison used on purpose, this might be a string or a number.
						// Who knows at this point.
						if (order != 0 && slotsObj[order]) {
							// Insert the order into the header row
							$(jquerySelectorPrefix + 'spellslot-order-row').append('<th>' + romanize(order) + '</th>');
							// And the number of spell slots of the given order onto the regular row below it
							$(jquerySelectorPrefix + 'spellslot-number-row').append('<td>' + slotsObj[order] + '</td>');
						}
					});
				}

				$('#resultsSpellcasting').show();
			}
		} catch (error) {
			$('#resultsSection').hide();
			throwError(error);
			throw error;
		}
	});
});
