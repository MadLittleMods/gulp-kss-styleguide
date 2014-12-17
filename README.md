# gulp-kss-styleguide

## Usage:
Pass in all of your styles (CSS, SASS, LESS). Yes, every file, not just the base file with the imports because we don't resolve them.
```
gulp.src('./css/**/*').pipe(kssStyleguide(/*options*/));
```

To generate a styleguide, use the `sectionBuildCallback` option. 
`sectionBuildCallback` will be called for each root section with the appropriate context
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

 - **`sectionBuildCallback`**: Callback used to build/compile the section (called multiple times for each section).
 	 - Parameters: `context`
 	 - You can return a stream or array of streams
 - **`allSectionsBuiltCallback`**: Callback after all sections are built. (called once)
 	 - Parameters: `context` (*note: does not include `currentRootReference` because it doesn't apply here*)
 	 - You can return a stream or array of streams

Also supports all of the [built-in node KSS options](https://github.com/kss-node/kss-node/wiki/Module-API#options).

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
			refence,
			header,
			description,
			isDeprecated,
			isExperimental,
			markup,
			modifiers: [
				{
					name,
					description,
					markup
				}
			]
		}
	]
}
```