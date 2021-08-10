export const getAllRegexMatches = (pattern: RegExp, content: string): RegExpExecArray[] => {
	const matches: RegExpExecArray[] = [];
	let match = pattern.exec(content);
	while (match !== null) {
		matches.push(match);
		match = pattern.exec(content);
	}
	return matches;
};