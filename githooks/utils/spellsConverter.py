# -*- coding: utf-8 -*-

import argparse, math, os, re, shutil, sys, tempfile, time

from copy import copy as copy
from docx import Document as DocumentCompose
from docx.shared import Pt
from docxcompose.composer import Composer
from docxtpl import DocxTemplate, RichText
from time import gmtime, strftime

###########
# Globals #
###########

# Arguments
g_args = None

# Templates
g_spellMarkdownN1300Template = None
g_spellHardCodexXMLEntryTemplate = None
g_spellHardCodexXMLCollectionTemplate = None
g_spellN1300CardDocxTemplatePaths = {} # dict of unicode

# Constants
TEMP_SUBDIRS_NAME = os.path.join(u'Unelith', u'.dnd5eSpellsConverter')
SEE_BOOK_TEXT = u'The description of this spell was considered too long. Please consult the rules or the DM for more details.'
CLASS_POINTER_CHARACTER = u'*'

# Maps
g_elementColors = {
	'fire': 'ff5d00',
	'earth': '5f7016',
	'light': 'dbc51f',
	'death': '232323',
	'darkness': '9c19ff',
	'aether': '1010ff',
	'air': 'b7b7b7',
	'water': '05beff',
	'demonology': 'd60000',
	'fire/demonology': 'd60000',
	'earth/demonology': 'd60000',
	'light/demonology': 'd60000',
	'death/demonology': 'd60000',
	'darkness/demonology': 'd60000',
	'aether/demonology': 'd60000',
	'air/demonology': 'd60000',
	'water/demonology': 'd60000'
}
g_schoolAbbreviations = {
	'Abjuration': 'Abj',
	'Conjuration': 'Conj',
	'Conjuration (Calling)': 'Conj,Ca',
	'Conjuration (Creation)': 'Conj,Cr',
	'Conjuration (Summoning)': 'Conj,S',
	'Conjuration (Teleportation)': 'Conj,T',
	'Divination': 'Div',
	'Divination (Scrying)': 'Div,S',
	'Enchantment': 'Ench',
	'Enchantment (Charm)': 'Ench,Ch',
	'Enchantment (Compulsion)': 'Ench,Cp',
	'Evocation': 'Evoc',
	'Illusion': 'Ill',
	'Illusion (Figment)': 'Ill,F',
	'Illusion (Glamer)': 'Ill,G',
	'Illusion (Pattern)': 'Ill,Pt',
	'Illusion (Phantasm)': 'Ill,Ph',
	'Illusion (Shadow)': 'Ill,S',
	'Necromancy': 'Necr',
	'Necromancy (Black)': 'Necr,B',
	'Necromancy (White)': 'Necr,W',
	'Transmutation': 'Trans'
}
g_classAbbreviations = {
	'Artificer': 'A',
	'Bard': 'B',
	'Cleric': 'C',
	'Druid': 'D',
	'Flagellant': 'F',
	'Paladin': 'P',
	'Ranger': 'R',
	'Sorcerer': 'S',
	'Sorceror': 'S',
	'Warlock': 'K',
	'Wizard': 'W'
}

##################
# Type functions #
##################

def assertUnicode(var, allowNone=False):
	if var is None:
		if allowNone:
			return None
		else:
			raise AssertionError

	if not type(var) in [str, unicode]:
		raise AssertionError

	if not isinstance(var, unicode):
		var = unicode(var)

	return var

def assertInt(var, allowNone=False):
	if var is None:
		if allowNone:
			return None
		else:
			raise AssertionError

	if not type(var) in [str, unicode, int, float]:
		raise AssertionError

	if not isinstance(var, int):
		var = int(var)

	return var

def assertBool(var, allowNone=False):
	if var is None:
		if allowNone:
			return None
		else:
			raise AssertionError

	if not type(var) in [str, unicode, int, bool]:
		raise AssertionError

	if type(var) in [str, unicode]:
		if var.lower() == 'true':
			var = True
		else:
			var = False

	elif isinstance(var, int):
		var = bool(var)

	return var

#######################
# String manipulation #
#######################

def ordinalNumber(num):
	assert isinstance(num, int)

	lastDigit = num % 10
	penultimateDigit = num % 100 / 10

	if penultimateDigit == 1:
		suffix = 'th'
	elif lastDigit == 1:
		suffix = 'st'
	elif lastDigit == 2:
		suffix = 'nd'
	elif lastDigit == 3:
		suffix = 'rd'
	else:
		suffix = 'th'

	return u'{0}{1}'.format(unicode(num), suffix)

def getCharacterWidthHeightRatio(char):
	assert type(char) in [str, unicode]
	assert len(char) == 1

	if char == ' ' or char.lower() in ['f', 'i', 'j', 'l', '\'', ',', '.', ':', ';', '!', '(', ')']:
		return 0.4
	elif char.lower() in ['m', 'w']:
		return 1.0
	elif char.isupper():
		return 0.9
	else:
		return 0.65

def measureTextWidth(text, fontSize):
	return sum(getCharacterWidthHeightRatio(char) * fontSize for char in text)

def willTextFit(text, width, height, fontSize, constLeading=None):
	# charWidth = width / fontSize
	charHeight = height / (fontSize if constLeading is None else constLeading)

	textParagraphs = text.split('\n')
	linesTaken = sum(math.ceil(measureTextWidth(paragraph, fontSize) / width) for paragraph in textParagraphs)

	return linesTaken <= charHeight

def findBestFontSize(text, width, height, defaultSize, sizeStep, constLeading=None, minFontSize=1, maxFontSize=None):
	if maxFontSize is None:
		maxFontSize = defaultSize + 1
	if minFontSize < 0:
		minFontSize = defaultSize + minFontSize

	fontSize = defaultSize

	# Text fits, but can be expanded for readabiltiy
	if willTextFit(text, width, height, fontSize, constLeading):
		# Increase one step at a time until it wouldn't fit anymore or the limit is reached
		while willTextFit(text, width, height, fontSize + sizeStep, constLeading) and fontSize + sizeStep <= maxFontSize:
			fontSize += sizeStep
		return fontSize

	# Font too small
	else:
		# Decrease one step at a time until it fits or the limit is reached
		while not willTextFit(text, width, height, fontSize - sizeStep, constLeading) and fontSize - sizeStep >= minFontSize:
			fontSize -= sizeStep
		return fontSize

def abbreviateTime(timeString):
	timeString = timeString.replace('Concentration, up to ', 'Conc, ')
	timeString = timeString.replace('Concentration', 'Conc')
	timeString = timeString.replace('bonus action', 'bns')
	timeString = timeString.replace('reaction', 'rea')
	timeString = timeString.replace('main action', 'a')
	timeString = timeString.replace('action', 'a')
	timeString = timeString.replace('minutes', 'min')
	timeString = timeString.replace('minute', 'min')
	timeString = timeString.replace('hours', 'h')
	timeString = timeString.replace('hour', 'h')
	timeString = timeString.replace('rounds', 'rnd')
	timeString = timeString.replace('round', 'rnd')

	return timeString

def abbreviateRange(rangeString):
	selfRangeDescription = re.search('Self \((.*?)\)', rangeString)
	if selfRangeDescription is not None:
		rangeString = selfRangeDescription.group(1)

	rangeString = rangeString.replace('feet', 'ft')
	rangeString = rangeString.replace('foot', 'ft')
	rangeString = rangeString.replace('meters', 'm')
	rangeString = rangeString.replace('meter', 'm')
	rangeString = rangeString.replace('radius', 'rad')

###############
# Spell class #
###############

class Spell(object):
	"""
	A class containing a set of strings describing a single spell.
	"""

	name = None				# unicode

	level = None 			# int
	classes = None 			# list<unicode>
	school = None 			# unicode
	element = None			# unicode

	castingTime = None		# unicode
	duration = None			# unicode
	range = None			# unicode
	components = None		# unicode
	ritual = None			# bool
	concentration = None	# unicode

	description = None		# unicode

	source = None			# unicode

	def __init__(self, name, level, classes, school, element, castingTime, duration, range, components,
					ritual, concentration, description, source):
		self.name = assertUnicode(name)
		self.level = assertInt(level)

		self.classes = []
		for cls in classes:
			self.classes.append(assertUnicode(cls))

		self.school = assertUnicode(school)
		self.element = assertUnicode(element, allowNone=True)

		self.castingTime = assertUnicode(castingTime)
		self.duration = assertUnicode(duration)
		self.range = assertUnicode(range)
		self.components = assertUnicode(components)

		self.ritual = assertBool(ritual)
		self.concentration = assertUnicode(concentration)

		self.description = assertUnicode(description)

		self.source = assertUnicode(source)

###################
# Files functions #
###################

def getAllSpellJsigvardHTMLFiles(cwd):
	"""
	A function singling out all the .html files containing spells in a given directory.

	:param cwd: The path to the directory in which the lookup is to be performed.
	:type cwd: str

	:return: A list of absolute paths to found files.
	:rtype: list
	"""
	spellFiles = []

	for root, dirs, files in os.walk(cwd):
		for file in files:
			if file.startswith(u'spell.php@s='):
				spellFiles.append(os.path.join(root, file))

	return spellFiles

def getAllSpellMarkdownFiles(cwd):
	"""
	A function singling out all the .html files containing spells in a given directory.

	:param cwd: The path to the directory in which the lookup is to be performed.
	:type cwd: str

	:return: A list of absolute paths to found files.
	:rtype: list
	"""
	spellFiles = []

	for root, dirs, files in os.walk(cwd):
		for file in files:
			if file.endswith(u'.md') and not file.endswith(u'.template.md'):
				spellFiles.append(os.path.join(root, file))

	return spellFiles

def getAllCardTemplateFiles(cwd):
	"""
	A function singling out all the .template.docx files containing card templates in the given directory.

	:param cwd: The path to the directory in which the lookup is to be performed.
	:type cwd: str

	:return: A list of absolute paths to found files.
	:rtype: list
	"""
	templateFiles = []

	for root, dirs, files in os.walk(cwd):
		for file in files:
			if file.endswith(u'.template.docx'):
				templateFiles.append(os.path.join(root, file))

	return templateFiles

def validateFilename(filename):
	"""
	A function dropping all illegal characters from a filename.

	:param filename: The old filename.
	:type filename: unicode

	:return: A valid filename.
	:rtype: unicode
	"""
	newname = filename.replace(':', '')
	newname = newname.replace('/', '-')
	newname = newname.replace('\\', '-')
	newname = newname.replace('*', '')
	newname = newname.replace('<', '')
	newname = newname.replace('>', '')
	newname = newname.replace('?', '')
	newname = newname.replace('|', '')
	newname = newname.replace('"', '')
	# newname = newname.replace('\'', '')

	return newname

def generateTempN1300CardDocx(contexts, _class, groupNumber=0):
	"""
	A function generating a temporary .docx file from a set of 9 spell contexts.

	WARNING! The temporary file must be *manually* deleted afterwards.

	:param contexts: A list of 9 or fewer spell context dictionaries.
	:type contexts: list
	:param _class: The name of the class, for which the spell cards are to be generated.
	:type _class: unicode
	:param groupNumber: The number of the context group being processed. This doubles as the filename of the temp file.
	:type groupNumber: int

	:return: The path to the generated file.
	:rtype: unicode
	"""

	global g_spellN1300CardDocxTemplatePaths
	global TEMP_SUBDIRS_NAME

	# Find the final context to apply to the template
	finalContext = {}

	# The [1; 9] interval.
	for i in range(1,10):
		key = 's{0}'.format(str(i))
		# If there is a corresponding context for this index number
		if i <= len(contexts):
			finalContext[key] = contexts[i-1]
		# Leave the remaining slots empty
		else:
			finalContext[key] = {}

	# Load and the template for the given class
	template = DocxTemplate(g_spellN1300CardDocxTemplatePaths[_class])

	# Render the result
	template.render(finalContext)

	# Create the temporary path if it doesn't exist
	tempPath = os.path.join(tempfile.gettempdir(), TEMP_SUBDIRS_NAME)
	try:
		os.makedirs(tempPath)
	except OSError:
		if not os.path.isdir(tempPath):
			raise

	# Save the result there
	tempFileName = u'{0}.docx'.format(unicode(groupNumber))
	tempFilePath = os.path.join(tempPath, tempFileName)
	template.save(tempFilePath)

	return tempFilePath

def tempCleanup():
	"""
	A function that purges the temp sub-directory belonging to this program.

	:rtype: None
	"""
	global TEMP_SUBDIRS_NAME

	absolutePath = os.path.join(tempfile.gettempdir(), TEMP_SUBDIRS_NAME)
	shutil.rmtree(absolutePath)

########################
# Conversion functions #
########################

def convertJsigvardHTMLToSpell(content, source):
	"""
	A function converting an .html file to an instance of the Spell class.

	:param content: The contents of the .html file.
	:type content: unicode

	:param source: The source of the spell (ex. "PHB")
	:type source: unicode

	:return: An object representing the spell.
	:rtype: Spell
	"""

	assert isinstance(content, unicode)

	# Split the part containing the spell itself
	spellContent = content.split('<title>', 1)[1]

	# Single out specific parts
	name = re.search('(.*?)</title>', spellContent).group(1)

	level = re.search('<span>Level: <b>(.*?)</b></span>', spellContent).group(1)
	if level.lower() == 'cantrip':
		level = 0

	classes = re.search('<span>Classes: <b>(.*?)</b></span>', spellContent).group(1).split(', ')
	school = re.search('<i>School: (.*?)</i>', spellContent).group(1)

	castingTime = re.search('<span>Casting Time: <b>(.*?)</b></span>', spellContent).group(1)
	duration = re.search('<span>Duration: <b>(.*?)</b></span>', spellContent).group(1)
	range = re.search('<span>Range: <b>(.*?)</b></span>', spellContent).group(1)
	components = re.search('<span>Components: <b>(.*?)</b></span>', spellContent).group(1)

	ritual = re.search('<span>Ritual: <b>(.*?)</b></span>', spellContent).group(1)
	concentration = re.search('<span>Concentration: <b>(.*?)</b></span>', spellContent).group(1)

	# Change HTML newlines to '\n'
	description = re.search('<b>Description</b></span></br><span>(.*?)</span>', spellContent).group(1)
	description = description.replace('<br>', '\n')

	spell = Spell(name, level, classes, school, None, castingTime, duration, range, components,
					ritual, concentration, description, source)

	return spell

def convertN1300MarkdownToSpell(content, source):
	"""
	A function converting an .md file to an instance of the Spell class.

	:param content: The contents of the .md file.
	:type content: unicode

	:param source: The source of the spell (ex. "PHB")
	:type source: unicode

	:return: An object representing the spell.
	:rtype: Spell
	"""

	assert isinstance(content, unicode)

	spellContent = unicode(content)

	# Single out specific parts
	name = re.search('## (.*?)\n', spellContent).group(1).strip()
	level = re.search('Level: \*\*(.*?)\*\*', spellContent).group(1).strip()
	classes = re.search('Classes: \*\*(.*?)\*\*', spellContent).group(1).strip().split(', ')
	school = re.search('School: \*\*(.*?)\*\*', spellContent).group(1).strip()
	element = re.search('Element: \*\*(.*?)\*\*', spellContent).group(1).strip()

	castingTime = re.search('Casting Time: \*\*(.*?)\*\*', spellContent).group(1).strip()
	duration = re.search('Duration: \*\*(.*?)\*\*', spellContent).group(1).strip()
	range = re.search('Range: \*\*(.*?)\*\*', spellContent).group(1).strip()
	components = re.search('Components: \*\*(.*?)\*\*', spellContent).group(1).strip()

	ritual = re.search('Ritual: \*\*(.*?)\*\*', spellContent).group(1).strip()
	concentration = re.search('Concentration: \*\*(.*?)\*\*', spellContent).group(1).strip()

	# Write newlines as '<br>' for a moment, so that the Regex doesn't stop on them
	spellContent = spellContent.replace('\n', '<br>')
	description = re.search('Description<br><br>(.*)', spellContent).group(1)
	description = description.replace('<br>', '\n')

	# Replace Markdown formatting with HTML
	def _encloseInHTMLTag(text, tag):
		return u'<{0}>{1}</{2}>'.format(tag, text, tag)

	# First, handle cases where the text is both bold and italic at the same time
	description = re.sub('\*\*\*(.*?)\*\*\*', lambda x: _encloseInHTMLTag(_encloseInHTMLTag(x.group(1), 'i'), 'b'), description)

	# Then parse bold, and italics last
	description = re.sub('\*\*(.*?)\*\*', lambda x: _encloseInHTMLTag(x.group(1), 'b'), description)
	description = re.sub('\*(.*?)\*', lambda x: _encloseInHTMLTag(x.group(1), 'i'), description)

	# And strip just in bloody case
	description = description.strip()

	spell = Spell(name, level, classes, school, element, castingTime, duration, range, components,
					ritual, concentration, description, source)

	return spell

def convertSpellToN1300Markdown(spell):
	"""
	A function converting an instance of the Spell class to an N:1300 Markdown description.

	:param spell: The spell to convert.
	:type spell: Spell

	:return: A Markdown spell file.
	:rtype: unicode
	"""
	global g_spellMarkdownN1300Template

	# Just in case, make sure that we're working on a new copy
	result = copy(g_spellMarkdownN1300Template)

	# Convert the HTML notation to Markdown notation in the description
	mdDescription = copy(spell.description)
	mdDescription = mdDescription.replace('<b>', '**')
	mdDescription = mdDescription.replace('</b>', '**')
	mdDescription = mdDescription.replace('<i>', '*')
	mdDescription = mdDescription.replace('</i>', '*')

	# Replace all the placeholders from the template
	result = result.replace('$name', spell.name)
	result = result.replace('$classes', ', '.join(spell.classes))
	result = result.replace('$level', unicode(spell.level))
	result = result.replace('$school', spell.school)
	result = result.replace('$element', (spell.element if spell.element is not None else ''))
	result = result.replace('$castingTime', spell.castingTime)
	result = result.replace('$duration', spell.duration)
	result = result.replace('$range', spell.range)
	result = result.replace('$components', spell.components)
	result = result.replace('$ritual', unicode(spell.ritual))
	result = result.replace('$concentration', unicode(spell.concentration))

	result = result.replace('$description', mdDescription)

	# Finalize
	return result

def convertSpellToHardCodexXMLEntry(spell, showElements=False):
	"""
	A function converting an instance of the Spell class to a HardCodex XML entry.

	:param spell: The spell to convert.
	:type spell: Spell

	:param showElements: Whether to replace class info with element info
	:type showElements: bool

	:return: A hardcodex XML entry representing the spell.
	:rtype: unicode
	"""
	global g_spellHardCodexXMLEntryTemplate

	# Just in case, make sure that we're working on a new copy
	result = copy(g_spellHardCodexXMLEntryTemplate)

	xmlDescription = copy(spell.description)

	# Change the newline notation to <text></text> blocks
	xmlDescription = '\t\t<text>' + xmlDescription
	xmlDescription = xmlDescription.replace('\n', '</text>\n\t\t<text>')

	# Drop formatting
	xmlDescription = xmlDescription.replace('<b>', '')
	xmlDescription = xmlDescription.replace('</b>', '')
	xmlDescription = xmlDescription.replace('<i>', '')
	xmlDescription = xmlDescription.replace('</i>', '')
	xmlDescription = xmlDescription.replace('<u>', '')
	xmlDescription = xmlDescription.replace('</u>', '')

	# The final newline, if present, is to be treated differently
	if xmlDescription.endswith('\n\t\t<text>'):
		xmlDescription = xmlDescription[:-len('\n\t\t<text>')]

	if not xmlDescription.endswith('</text>'):
		xmlDescription += '</text>'

	# Include ritual information
	if spell.ritual:
		xmlDescription = '\t\t<ritual>YES</ritual>\n' + xmlDescription

	# Replace all the placeholders from the template
	result = result.replace('$name', spell.name)
	result = result.replace('$level', unicode(spell.level))
	result = result.replace('$school', (spell.school[0].upper() if not spell.school.lower().startswith('e') else spell.school[:2].upper()))
	result = result.replace('$castingTime', spell.castingTime)
	result = result.replace('$range', spell.range)
	result = result.replace('$components', spell.components)
	result = result.replace('$duration', spell.duration)
	result = result.replace('$classes', (', '.join(spell.classes) if not showElements else (spell.element if spell.element is not None else 'Colorless')))

	result = result.replace('$description', xmlDescription)

	# Finalize
	return result

def convertSpellToN1300CardDocxContext(spell, descrBoxWidth=None, descrBoxHeight=None, descrFontSize=None, descrFontPrecision=0.5, descrConstLeading=None):
	"""
	A function converting an instance of the Spell class to an N1300 card docxtpl context.

	:param spell: The spell to convert.
	:type spell: Spell

	:return: A dictionary containing data ready to be used as an element of the docxtpl context.
	:rtype: dict
	"""
	global g_elementColors
	global SEE_BOOK_TEXT

	# Drop formatting in the description
	descr = spell.description.replace('<b>', '')
	descr = descr.replace('</b>', '')
	descr = descr.replace('<i>', '')
	descr = descr.replace('</i>', '')
	descr = descr.replace('<u>', '')
	descr = descr.replace('</u>', '')

	# Adjust the description font size if parameters provided
	if all(x is not None for x in [descrBoxWidth, descrBoxHeight, descrFontSize]): # constLeading *can* have a value of None
		# It has to be multiplied by 2, because apparently, docxtpl, for some reason used half the provided value
		fontSizeEstimate = findBestFontSize(descr, descrBoxWidth, descrBoxHeight, descrFontSize, descrFontPrecision, descrConstLeading, -1)
		newDescrFontSize = 2*fontSizeEstimate

		# Now, if the text *still* doesn't fit, take only the first paragraph, and add a note to consult the book.
		if not willTextFit(descr, descrBoxWidth, descrBoxHeight, fontSizeEstimate, descrConstLeading):
			paragraphs = descr.split('\n')
			descr = u'{0}\n \n{1}'.format(paragraphs[0], SEE_BOOK_TEXT)

			# Re-fit the new text
			fontSizeEstimate = findBestFontSize(descr, descrBoxWidth, descrBoxHeight, descrFontSize, descrFontPrecision, descrConstLeading, -1)
			newDescrFontSize = 2*fontSizeEstimate
	else:
		newDescrFontSize = None

	# Search for material components
	materialComponentSearch = re.search('M \((.*?)\)', spell.components)
	materialComponents = materialComponentSearch.group(1) if materialComponentSearch is not None else u'' # Isolate the material component description from the brackets

	# materialComponents style
	mcColor = 'ffffff'.upper()
	mcFontSize = 7

	# Final result
	return {
		'name': RichText(spell.name.upper(), color=(g_elementColors[spell.element.lower()].upper() if spell.element.lower() in g_elementColors else None)),
		'castingTime': RichText(spell.castingTime),
		'range': RichText(spell.range),
		'components': RichText(spell.components.split('(')[0].strip()),										# Isolate the component type abbreviations
		'matComponents': RichText(materialComponents, color=mcColor, size=mcFontSize*2, italic=True),
		'duration': RichText(spell.duration),
		'description': RichText(descr, size=newDescrFontSize),
		'level': RichText(ordinalNumber(spell.level) + u' ') if spell.level != 0 else u'', # Add a trailing space for the same reason as below
		'lv': RichText(unicode(spell.level)), # The number denoting the spell level to put on the backface
		'school': RichText(spell.school),
		'element': RichText(spell.element),
		'cantrip': RichText(u' Cantrip') if spell.level == 0 else u'' # The leading space is required, as docxtpl for some reason omits the space in the footer
	}

def convertSpellToCSVIndexRow(spell, skipClass=False):
	"""
	A function converting an instance of the Spell class to a single row for a CSV index file.

	:param spell: The spell to convert.
	:type spell: Spell
	:param skipClass: If true, the class column will be skipped
	:type skipClass: bool

	:return: A string containing the index entry, separated with ';'.
	:rtype: unicode
	"""

	# TODO: Solve the problem of still displaying subclasses in a better way
	#  For now, this is just an ugly workaround to make it work by never
	#  skipping the class column.
	skipClass = False

	columns = []
	tags = []

	# Determine the saves
	saves = []
	if re.search('strength save|strength saving throw', spell.description, re.IGNORECASE) is not None:
		saves.append('Str')
	elif re.search('dexterity save|dexterity saving throw', spell.description, re.IGNORECASE) is not None:
		saves.append('Dex')
	elif re.search('constitution save|constitution saving throw', spell.description, re.IGNORECASE) is not None:
		saves.append('Con')
	elif re.search('intelligence save|intelligence saving throw', spell.description, re.IGNORECASE) is not None:
		saves.append('Int')
	elif re.search('wisdom save|wisdom saving throw', spell.description, re.IGNORECASE) is not None:
		saves.append('Wis')
	elif re.search('charisma save|charisma saving throw', spell.description, re.IGNORECASE) is not None:
		saves.append('Cha')
	elif re.search('touch spell attack', spell.description, re.IGNORECASE) is not None:
		saves.append('TAC')
	elif re.search('touch attack', spell.description, re.IGNORECASE) is not None:
		saves.append('TAC')
	elif re.search('spell attack', spell.description, re.IGNORECASE) is not None:
		saves.append('AC')

	columns.append(unicode(spell.name))
	columns.append(unicode(spell.level))
	columns.append(unicode(spell.school))
	columns.append(unicode(spell.element))
	columns.append(unicode(spell.castingTime))

	if spell.concentration.lower() != 'true':
		tags.append(u'no conc')
		tags.append(u'no concentration')
		columns.append('' if spell.concentration.lower() == 'false' else spell.concentration)
	else:
		columns.append(u'Concentration')

	if spell.ritual:
		columns.append(u'Ritual')
	else:
		columns.append(u'')
		tags.append(u'no ritual')

	columns.append(unicode(spell.duration))
	columns.append(unicode(spell.components))

	if not skipClass:
		columns.append(unicode(', '.join(spell.classes)))
		# If this spell is accessible to a class regardless of its subclass,
		#  add the {class}* tag, for example: Cleric*
		for className in spell.classes:
			if not ('(' in className or ')' in className):
				tags.append(className + CLASS_POINTER_CHARACTER)

	# Add the {element}* tag, for example Water*
	tags.append(spell.element + CLASS_POINTER_CHARACTER)

	levelSubdir = u'Cantrips' if spell.level == 0 else u'Level{}'.format(spell.level)
	columns.append(unicode('#!spells/{}/{}.md'.format(levelSubdir, validateFilename(spell.name))))

	columns.insert(0, u','.join(tags))

	return u';'.join(columns)

def convertSpellToMPMBDatabaseEntry(spell):
	"""
	A function converting an instance of the Spell class to a single database entry for the MPMB's Spell Sheet Generator.

	:param spell: The spell to convert.
	:type spell: Spell

	:return: A string containing the database entry, separated with '\t'.
	:rtype: unicode
	"""
	global g_schoolAbbreviations

	columns = []

	columns.append(unicode(spell.name)) # Spell_Name_Full

	# Some placeholders
	for i in range(0, 8):
		columns.append(u'')

	columns.append(unicode(spell.level)) # Level

	# Class columns
	columns.append(u'x' if re.search('rogue \(arcane trickster\)', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')
	columns.append(u'x' if re.search('bard', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')
	columns.append(u'x' if re.search('cleric', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')
	columns.append(u'x' if re.search('druid', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')
	columns.append(u'x' if re.search('fighter \(eldritch knight\)', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')
	columns.append(u'x' if re.search('paladin', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')
	columns.append(u'x' if re.search('ranger', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')
	columns.append(u'x' if re.search('sorcerer', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')
	columns.append(u'x' if re.search('warlock', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')
	columns.append(u'x' if re.search('wizard', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None else u'')

	columns.append(unicode(spell.name) if not spell.ritual else u'{} (R)'.format(spell.name)) # Spell
	columns.append(unicode(spell.source[0])) # B
	columns.append(u'') # Pg.
	columns.append(unicode(g_schoolAbbreviations[spell.school]) if spell.school in g_schoolAbbreviations else u'Univ') # School

	columns.append(unicode(abbreviateTime(spell.castingTime))) # Time
	columns.append(unicode(abbreviateRange(spell.range))) # Range_Imperial
	columns.append(u'') # Range_Metric

	# Search for material components
	materialComponentSearch = re.search('M \((.*?)\)', spell.components)
	materialComponents = materialComponentSearch.group(1) if materialComponentSearch is not None else u'' # Isolate the material component description from the brackets

	components = unicode(spell.components.split('(')[0].strip())

	if re.search('gp', materialComponents, re.IGNORECASE) is not None and re.search('worth', materialComponents, re.IGNORECASE) is not None:
		components += u'f' if re.search('the spell consumes', materialComponents, re.IGNORECASE) is None else u'\u253c'

	columns.append(unicode(components)) # Comp

	columns.append(u'') # GP

	# Determine the save
	save = u'-'
	if re.search('strength save|strength saving throw', spell.description, re.IGNORECASE) is not None:
		save = 'Str'
	elif re.search('dexterity save|dexterity saving throw', spell.description, re.IGNORECASE) is not None:
		save = 'Dex'
	elif re.search('constitution save|constitution saving throw', spell.description, re.IGNORECASE) is not None:
		save = 'Con'
	elif re.search('intelligence save|intelligence saving throw', spell.description, re.IGNORECASE) is not None:
		save = 'Int'
	elif re.search('wisdom save|wisdom saving throw', spell.description, re.IGNORECASE) is not None:
		save = 'Wis'
	elif re.search('charisma save|charisma saving throw', spell.description, re.IGNORECASE) is not None:
		save = 'Cha'
	elif re.search('touch spell attack', spell.description, re.IGNORECASE) is not None:
		save = 'TAC'
	elif re.search('touch attack', spell.description, re.IGNORECASE) is not None:
		save = 'TAC'
	elif re.search('spell attack', spell.description, re.IGNORECASE) is not None:
		save = 'AC'

	columns.append(unicode(save)) # Save
	columns.append(unicode(abbreviateTime(spell.duration))) # Duration

	columns.append(u'') # Description_Imperial
	columns.append(u'') # Description_Metric

	columns.append(unicode(spell.name)) # Spell_name_Full2

	return u'\t'.join(columns)

############################
# Initialization functions #
############################

def loadTemplates():
	global g_spellMarkdownN1300Template
	global g_spellHardCodexXMLEntryTemplate
	global g_spellHardCodexXMLCollectionTemplate
	global g_spellN1300CardDocxTemplatePaths

	templateFile = open('SpellTemplate.template.md', 'r')
	g_spellMarkdownN1300Template = templateFile.read().decode('utf-8')
	templateFile.close()

	templateFile = open('HardCodexEntryTemplate.template.xml', 'r')
	g_spellHardCodexXMLEntryTemplate = templateFile.read().decode('utf-8')
	templateFile.close()

	templateFile = open('HardCodexTemplate.template.xml', 'r')
	g_spellHardCodexXMLCollectionTemplate = templateFile.read().decode('utf-8')
	templateFile.close()

	# Assign all the N:1300 cards template file paths to the dictionary, keyed by class name
	cardTemplateFiles = getAllCardTemplateFiles(os.getcwd())
	for path in cardTemplateFiles:
		name = os.path.basename(path)[:-len('.template.docx')] # Get the filename and drop the extension to find the corresponding class
		g_spellN1300CardDocxTemplatePaths[name] = path

def parseArgs():
	global g_args
	argParser = argparse.ArgumentParser(description='Convert D&D 5e spells between specific formats.')

	argParser.add_argument('--from', choices=['jsivhtml', 'n1300md'], help='Source format.', required=True, dest='sourceFormat')
	argParser.add_argument('--to', choices=['hardcodex', 'n1300md', 'n1300cards', 'csvIndex', 'MPMBdata'], help='Target format.', required=True, dest='targetFormat')

	argParser.add_argument('-p', help='The target path to the directory containing files to be converted.', dest='path')
	argParser.add_argument('-t', help='The target filename, has no effect for n1300cards format.', dest='targetFileName')
	argParser.add_argument('-e', help='This only has effect when converting to the hardcodex format. With this flag, the cards will be sorted by elements rather than classes.', action='store_true')
	argParser.add_argument('-m', help='A minimal version, skips the template loading step', action='store_true')

	argParser.add_argument('--class', help='This only has effect and is *required* when converting to the n1300cards format. This flag specifies for which class the cards are to be generated.', dest='className')

	g_args = argParser.parse_args()

	if g_args.targetFormat == 'n1300cards' and g_args.className is None:
		argParser.error('The n1300cards format requires the --class argument.')

######################
# Workflow functions #
######################

def seekReadConvertFiles(sourceFormat):
	"""
	A function that searches for spell files in the working directory, reads data from them
	 and converts the context of each individual file to an instance of the Spell class.

	:param sourceFormat: What kind of files to look and what format to convert from.
	:type sourceFormat: str

	:return: A list of Spell objects.
	:rtype: list
	"""

	assert isinstance(sourceFormat, str)

	spells = []

	if sourceFormat == 'jsivhtml':
		# Get paths to all the files in question
		paths = getAllSpellJsigvardHTMLFiles(os.getcwd())

		for path in paths:
			# Read the file and close it
			file = open(path, 'r')
			content = file.read().decode('utf-8')
			file.close()

			# Find the source based on the filename
			source = re.search('&src=(.*)', path)
			if source is None:
				print >> sys.stderr, u'Error processing file \'{0}\' - no source found in the filename.'.format(path)
				continue

			source = source.group(1).upper()

			# Get a Spell object and append it to the list
			try:
				spells.append(convertJsigvardHTMLToSpell(content, source))
			except ValueError as e:
				print >> sys.stderr, u'Error processing file \'{0}\':\n{1}'.format(path, unicode(e))

	elif sourceFormat == 'n1300md':
		# Get paths to all the files in question
		paths = getAllSpellMarkdownFiles(os.getcwd())

		for path in paths:
			# Read the file and close it
			file = open(path, 'r')
			content = file.read().decode('utf-8')
			file.close()

			# The N1300 Markdown files drop source information, therefore assume it to be N1300
			source = 'N:1300'

			# Get a Spell object and append it to the list
			try:
				spells.append(convertN1300MarkdownToSpell(content, source))
			except ValueError as e:
				print >> sys.stderr, u'Error processing file \'{0}\':\n{1}'.format(path, unicode(e))

	else:
		raise ValueError('Unknown source format \'{}\'.'.format(sourceFormat))

	return spells

def convertAndSaveSpells(spells, targetFormat, tagByElements=False, filterByClass=None, targetFileName=None):
	"""
	A function that takes a list of Spell objects, converts them to the desired format and saves the file(s)
	 in the working directory.

	For the 'hardcodex' format, a single .xml file containing all the spells that have been converted will be
	 generated and saved in the working directory, named accordingly to the current time.

	For the 'n1300md' format, multiple .md files will be generated and saved in a sub-directory of the working
	 directory, called 'n1300md'. Inside this directory, there will be a separate directory for each level.

	For the 'n1300cards' format, a .docx file containing all the cards will be created.

	For the 'MPMBdata' format, a .txt file containing the database will be created.

	:param spells: A list of Spell object to be converted.
	:type spells: list
	:param targetFormat: What format to convert to.
	:type targetFormat: str
	:param tagByElements: Only important if targetFormat == 'hardcodex'. If True, spells will be tagged by elements in place of classes.
	:type tagByElements: bool
	:param filterByClass: Only important and required if targetFormat == 'n1300cards'. If True, only cards for a given class will be processed.
	:type filterByClass: unicode
	:param targetFileName: If given, this filename is used instead of a generated one.
	:type targetFileName: unicode

	:return: The number of spells being converted.
	:rtype: int
	"""

	global g_spellHardCodexXMLCollectionTemplate

	assert isinstance(spells, list)
	assert isinstance(targetFormat, str)

	if targetFormat == 'hardcodex':
		entries = [convertSpellToHardCodexXMLEntry(spell, tagByElements) for spell in spells]
		collection = g_spellHardCodexXMLCollectionTemplate.replace('$spellEntries', u''.join(entries))

		collectionFileName = targetFileName if targetFileName is not None else validateFilename(strftime('spells-%Y%m%d-%H%M%S.xml', gmtime()))

		file = open(collectionFileName, 'w')
		file.write(collection.encode('utf-8'))
		file.close()

	elif targetFormat == 'n1300md':
		pathsTaken = []
		subDirName = targetFormat

		for spell in spells:
			md = convertSpellToN1300Markdown(spell)

			levelDirName = 'Cantrips' if spell.level == 0 else 'Level{}'.format(str(spell.level))
			filename = validateFilename(spell.name)

			# Create directiories if they don't exist
			levelDirPath = os.path.join(os.getcwd(), subDirName, levelDirName)
			try:
				os.makedirs(levelDirPath)
			except OSError:
				if not os.path.isdir(levelDirPath):
					raise

			# Find the path to the file itself, at the moment, without the extension
			path = os.path.join(levelDirPath, filename)

			# Add source info to the file if there already exists a spell of the same name and level, if the source is known
			if path in pathsTaken and spell.source is not None and spell.source != '':
				path = u'{0} ({1})'.format(path, spell.source)

			# If the name is still taken, keep appending underscores until there are no duplicates
			while path in pathsTaken:
				path += '_'

			# At this point, a name has been determined that certainly hasn't been taken, so proceed with it
			pathsTaken.append(path)

			# For convenience, '.md' is only added at the very final step, it's not included in any of the paths from the
			#  pathsTaken list. This is done to avoid multiple cases of redundant string processing above.
			path += u'.md'

			# Write the file
			file = open(path, 'w')
			file.write(md.encode('utf-8'))
			file.close()

	elif targetFormat == 'n1300cards':
		# filterByClass must be given for this targetFormat
		if filterByClass is None:
			raise ValueError('No class filter provided for conversion to N:1300 cards.')

		filterByClass = filterByClass.lower()

		# First, for later convenience, sort spells alphabetically and then by level *at this point*
		spells.sort(key = lambda spell: spell.name)
		spells.sort(key = lambda spell: spell.level)

		# Eliminate all the spells that can never be accessed by the provided class
		if filterByClass == 'sorcerer':
			# Sorcerers have both their unique spells and the entire Wizard spell list. However, they do not have the
			#  spells provided by specific Wizard subclasses, therefore search for "Wizard" not followed by " (", to
			#  exclude results such as "Wizard (Necromancer)".
			spellContexts = [convertSpellToN1300CardDocxContext(spell, 216, 130, 6.0, 0.5, 6.0) for spell in spells if re.search('sorcerer|wizard(?! \()', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None]
		else:
			spellContexts = [convertSpellToN1300CardDocxContext(spell, 216, 130, 6.0, 0.5, 6.0) for spell in spells if re.search(filterByClass, u', '.join(spell.classes), re.IGNORECASE) is not None]

		# Divide contexts into groups of 9 or fewer
		contextGroups = [spellContexts[i:i+9] for i in range(0, len(spellContexts), 9)]

		# Render into temporary files
		resultTempFilePaths = [generateTempN1300CardDocx(group, filterByClass, idx + 1) for idx, group in enumerate(contextGroups)]

		# Merge the temp files, if there were any cards generated
		if len(resultTempFilePaths) > 0 and len(spellContexts) > 0:
			# Set the first file as the master
			master = DocumentCompose(resultTempFilePaths[0])
			composer = Composer(master)

			for i in range(1, len(resultTempFilePaths)):
				path = resultTempFilePaths[i]
				doc = DocumentCompose(path)
				composer.append(doc)

			# At long last - save the *final* result
			combinedFileName = targetFileName if targetFileName is not None else validateFilename(strftime('cards-{0}-%Y%m%d-%H%M%S.docx'.format(filterByClass), gmtime()))
			composer.save(combinedFileName)

		# Return the number of included spells
		return len(spellContexts)

	elif targetFormat == 'MPMBdata':
		entries = [convertSpellToMPMBDatabaseEntry(spell).strip() for spell in spells]
		collection = u'\n'.join(entries)

		collectionFileName = targetFileName if targetFileName is not None else validateFilename(strftime('spells-%Y%m%d-%H%M%S.txt', gmtime()))

		file = open(collectionFileName, 'w')
		file.write(collection.encode('utf-8'))
		file.close()

	elif targetFormat == 'csvIndex':
		if filterByClass is not None:
			filterByClass = filterByClass.strip().lower()

		headers = ['!tags', 'Name', 'Level', 'School', 'Element', 'Casting time', 'Concentration', 'Ritual', 'Duration', 'Components', 'Classes', '!href']
		skipClass = filterByClass is not None

		# TODO: Find a better way to solve this, this is an ugly workaround:
		#  Remove this later
		skipClass = False

		headerRow = ';'.join([header for header in headers if not skipClass or header != 'Classes'])

		# Eliminate all the spells that can never be accessed by the provided class
		if filterByClass == 'sorcerer':
			# Sorcerers have both their unique spells and the entire Wizard spell list. However, they do not have the
			#  spells provided by specific Wizard subclasses, therefore search for "Wizard" not followed by " (", to
			#  exclude results such as "Wizard (Necromancer)".
			rows = [convertSpellToCSVIndexRow(spell, skipClass).strip() for spell in spells if filterByClass is None or re.search('sorcerer|wizard(?! \()', u', '.join(spell.classes).strip(), re.IGNORECASE) is not None]
		else:
			rows = [convertSpellToCSVIndexRow(spell, skipClass).strip() for spell in spells if filterByClass is None or re.search(filterByClass, u', '.join(spell.classes).strip(), re.IGNORECASE) is not None]

		collection = u'\n'.join([headerRow] + rows)

		collectionFileName = targetFileName if targetFileName is not None else validateFilename(strftime('spells-%Y%m%d-%H%M%S.csv', gmtime()))

		file = open(collectionFileName, 'w')
		file.write(collection.encode('utf-8'))
		file.close()

	else:
		raise ValueError('Unknown target format \'{}\'.'.format(sourceFormat))

	return len(spells)

#######
# Run #
#######

def main():
	global g_args

	# Run all the initialization functions
	parseArgs()
	if not g_args.m:
		loadTemplates()

	# Create the temporary path if it doesn't exist
	tempPath = os.path.join(tempfile.gettempdir(), TEMP_SUBDIRS_NAME)
	try:
		os.makedirs(tempPath)
	except OSError:
		if not os.path.isdir(tempPath):
			raise

	# Change the path if there was such a demand
	if g_args.path is not None:
		os.chdir(g_args.path)

	spells = seekReadConvertFiles(g_args.sourceFormat)
	count = convertAndSaveSpells(spells, g_args.targetFormat, g_args.e, g_args.className, g_args.targetFileName)

	print u'{0} files successfully converted from {1} to {2}!'.format(count, g_args.sourceFormat, g_args.targetFormat)

	# Clean up the mess
	tempCleanup()

# Run main
main()
