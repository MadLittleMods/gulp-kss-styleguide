# gulp-kss-styleguide

Generate styleguides from [KSS syntax](https://github.com/kneath/kss) comments.

This plugin does not lock you down to a certain templating system etc. Just use the callbacks and context to render/generate your own templates ([Handlebars](http://handlebarsjs.com/), [Nunjucks](https://mozilla.github.io/nunjucks/), etc).


## Usage:
Pass in all of your styles (CSS, SASS, LESS). Yes, every file, not just the base file with the imports because we don't resolve them.
```
gulp.src('./css/**/*').pipe(kssStyleguide(/*options*/));
```

To generate a styleguide, use the `sectionBuildCallback` option. 
`sectionBuildCallback` will be called for each root section with the appropriate context. `allSectionsBuiltCallback` is called once and is good for moving over assets(styleguide styles, javascript, etc) or making an overview page.

You can return a stream or an array of streams in each callback. We use these to determine when the gulp task is finished.
```
gulp.src('./css/**/*').pipe(kssStyleguide({
	sectionBuildCallback: function(context) {
		return gulp.src('./template/section.html')
			.pipe(renderTemplate(context));
	},
	allSectionsBuiltCallback: function(context) {
		// Copy over the assets
		return gulp.src('./template/assets/**/*')
			.pipe(gulp.dest('./dist'));
	}
}));
```


## Options

 - **`sectionBuildCallback`**: Callback used to build/compile each section. *(called multiple times for each section)*
 	 - Parameters: `context`
 	 - You can return a stream or array of streams
 - **`allSectionsBuiltCallback`**: Callback after all sections are built. *(called once)*
 	 - Parameters: `context` (*note: does not include `currentRootReference` because it doesn't apply here*)
 	 - You can return a stream or array of streams

Also passes along all of the [built-in node KSS options](https://github.com/kss-node/kss-node/wiki/Module-API#options).

### Context

```
var context = {
	kssMap: sectionMap,
	currentRootReference: number
};
```

The `sectionMap` consists of many sections and many modifiers per section:
```
sectionMap = {
	sections: [
		{
			reference, // The number representing the section (1.1, 2.5, etc)
			header, // The name of the section
			description, // More details explaining the section
			isDeprecated, // boolean
			isExperimental, // boolean
			markup, // Generic markup with the ${modifiers}, NOT filled in
			modifiers: [
				{
					name, // Name of the modifier (`:hover`, `.disabled`, `-hanging`)
					description, // More details explaining the section
					markup // Markup with the modifier in place
				}
			]
		}
	]
}
```