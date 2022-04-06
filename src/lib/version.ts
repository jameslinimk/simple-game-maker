const version = () => {
	let rv: { edition: number; date_published: string; name?: string; name_code?: string }

	return (
		(rv = null),
		"function" == typeof RegExp &&
			(rv = {
				edition: 3,
				date_published: "1999-12"
			}),
		"function" == typeof Array.isArray &&
			(rv = {
				edition: 5,
				date_published: "2009-12"
			}),
		("function" != typeof (<any>Array).find && "function" != typeof (<any>Array).findIndex) ||
			(rv = {
				edition: 6,
				date_published: "2015-06",
				name: "ECMAScript 2015",
				name_code: "ES2015"
			}),
		"function" == typeof Array.prototype.includes &&
			(rv = {
				edition: 7,
				date_published: "2016-06",
				name: "ECMAScript 2016",
				name_code: "ES2016"
			}),
		"function" == typeof Object.entries &&
			(rv = {
				edition: 8,
				date_published: "2017-06",
				name: "ECMAScript 2017",
				name_code: "ES2017"
			}),
		"undefined" != typeof Promise &&
			"function" == typeof Promise.prototype.finally &&
			(rv = {
				edition: 9,
				date_published: "2018-06",
				name: "ECMAScript 2018",
				name_code: "ES2018"
			}),
		("function" != typeof Object.fromEntries && "function" != typeof String.prototype.trimStart) ||
			(rv = {
				edition: 10,
				date_published: "2019-06",
				name: "ECMAScript 2019",
				name_code: "ES2019"
			}),
		"function" == typeof BigInt &&
			(rv = {
				edition: 11,
				date_published: "2020-06",
				name: "ECMAScript 2020",
				name_code: "ES2020"
			}),
		rv
	)
}

export default version
export const esEdition = version().edition
