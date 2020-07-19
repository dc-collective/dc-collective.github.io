export default function(text) {
	if(!text || typeof text !== 'string') {
		return text;
	}

	// Filter out swears
	text = text.replace(/(shit|fuck|bitch|cunt)/gi, '■■■■');

	// @TODO: If anyone is going to put slurs in their script... please don't, but I'll add them in if I really have to
	return text;
}