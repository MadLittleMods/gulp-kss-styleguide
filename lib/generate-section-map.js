var extend = require('extend'); // https://www.npmjs.org/package/extend

function toContextModifier(kssModifier) {
	var modifier = {};
	modifier.name = kssModifier.name();
	modifier.description = kssModifier.description();
	modifier.markup = kssModifier.markup();

	return modifier;
}

function toContextSection(kssSection) {
	var section = {};
	section.reference = kssSection.reference();
	section.header = kssSection.header();
	section.description = kssSection.description();
	section.isDeprecated = kssSection.deprecated();
	section.isExperimental = kssSection.experimental();
	section.markup = kssSection.markup();
	section.modifiers = [];

	var modifiers = kssSection.modifiers() || [];
	modifiers.forEach(function(modifier) {
		section.modifiers.push(toContextModifier(modifier));
	});

	return section;
}


function generateSectionMap(kssStyleguide) {
	var sections = kssStyleguide.section();
			
	var sectionMap = {};
	sections.forEach(function(section) {
		var currentRootNumber = section.reference().match(/^([0-9]+)/)[1];

		var isRoot = section.reference().match(/^[0-9]+(?:(\.0+)+)?\.?$/);

		if(sectionMap[currentRootNumber] == null) {
			sectionMap[currentRootNumber] = {};
			sectionMap[currentRootNumber]['sections'] = [];

			if(isRoot) {
				sectionMap[currentRootNumber] = extend({}, sectionMap[currentRootNumber], toContextSection(section));
			}
		}
		sectionMap[currentRootNumber]['sections'].push(toContextSection(section));
	});

	return sectionMap;
}


module.exports = generateSectionMap;