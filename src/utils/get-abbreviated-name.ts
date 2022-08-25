const getAbbreviatedName = (name: string): string => {
	let abbreviation: string = "";
	const words: string[] = name.split(" ");
	words.forEach((word) => {
		abbreviation += word[0].toUpperCase();
	});
	return abbreviation;
};

export default getAbbreviatedName;
