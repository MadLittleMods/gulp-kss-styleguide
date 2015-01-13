var extend = require('extend'); // https://www.npmjs.org/package/extend

function toContextModifier(kssModifier) {
	//console.log(kssModifier);
	//console.log(Object.getPrototypeOf(kssModifier));
	var modifier = {};
	modifier.name = kssModifier.name();
	modifier.className = kssModifier.className();
	modifier.description = kssModifier.description();
	modifier.markup = kssModifier.markup ? kssModifier.markup() : (function() {
		return (kssModifier.section().markup() || '').replace(/\{\$modifiers\}/g, kssModifier.className());
	})();

	return modifier;
}

function toContextParameter(kssParameter) {
	var parameter = {};
	parameter.name = kssParameter.name();
	parameter.description = kssParameter.description();

	return parameter;
}

function toContextSection(kssSection) {
	var section = {};
	section.reference = kssSection.reference();
	section.header = kssSection.header();
	section.description = kssSection.description();
	section.parameters = (function() {
		return (kssSection.parameters() || []).map(function(parameter) {
			return toContextParameter(parameter);
		});
	})();
	section.isDeprecated = kssSection.deprecated();
	section.isExperimental = kssSection.experimental();
	section.markupCode = kssSection.markup();
	// This will give a vanilla module with no modifier
	section.markup = section.markupCode ? section.markupCode.replace(/\{\$modifiers\}/m, '') : false;
	section.modifiers = (function() {
		return (kssSection.modifiers() || []).map(function(modifier) {
			return toContextModifier(modifier);
		});
	})();


	return section;
}


function generateSectionMap(kssStyleguide) {
	var sections = kssStyleguide.section();
			
	var sectionMap = {};
	sections.forEach(function(section) {
		var currentRootNumber = section.reference().match(/^([0-9]+)/)[1];

		var isRoot = section.reference().match(/^[0-9]+(?:(\.0+)+)?\.?$/);

		// Create the root section, if it doesn't already exist
		if(sectionMap[currentRootNumber] == null) {
			sectionMap[currentRootNumber] = {};
			sectionMap[currentRootNumber]['sections'] = [];

			if(isRoot) {
				sectionMap[currentRootNumber] = extend({}, sectionMap[currentRootNumber], toContextSection(section, isRoot));
			}
		}

		// Add every seciton but the root itself to the list
		if(!isRoot) {
			sectionMap[currentRootNumber]['sections'].push(toContextSection(section));
		}
	});

	return sectionMap;
}


module.exports = generateSectionMap;