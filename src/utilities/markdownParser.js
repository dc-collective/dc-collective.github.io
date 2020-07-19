let mdContainer = require('markdown-it-container');
let md = require('markdown-it')({ breaks: true })
	.use(mdContainer, 'panel')
	.use(mdContainer, 'dialogue', {
		marker: '"'
	});
		// .use(require('markdown-it-bracketed-spans'))
		// .use(require('markdown-it-attrs'));

export default md;