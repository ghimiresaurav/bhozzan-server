export const generateRegex = (query: string): RegExp => {
	// Since searchQuery is most likely being extracted  from url, URL encode of spaces should be replaced by actual spaces
	// Split the search query by spaces or "%20"
	const words = query.trim().split(/\s+|%20/)
	let regexQuery = '[a-z\\s]*'
	// Create regex query by separating words
	words.forEach((word) => (regexQuery += word + '[a-z\\s]*'))
	// Create regex out of regex query
	const regex = new RegExp(regexQuery, 'i')
	return regex
}
