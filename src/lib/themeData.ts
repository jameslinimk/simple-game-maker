const themeData: [name: string, value: string, theme: "light" | "dark"][] = [
	["One Dark (default)", "one_dark", "dark"],
	["Ambiance", "ambiance", "dark"],
	["Chaos", "chaos", "dark"],
	["Clouds Midnight", "clouds_midnight", "dark"],
	["Dracula", "dracula", "dark"],
	["Cobalt", "cobalt", "dark"],
	["Gruvbox", "gruvbox", "dark"],
	["Green on Black", "gob", "dark"],
	["idle Fingers", "idle_fingers", "dark"],
	["krTheme", "kr_theme", "dark"],
	["Merbivore", "merbivore", "dark"],
	["Merbivore Soft", "merbivore_soft", "dark"],
	["Mono Industrial", "mono_industrial", "dark"],
	["Monokai", "monokai", "dark"],
	["Nord Dark", "nord_dark", "dark"],
	["Pastel on dark", "pastel_on_dark", "dark"],
	["Solarized Dark", "solarized_dark", "dark"],
	["Terminal", "terminal", "dark"],
	["Tomorrow Night", "tomorrow_night", "dark"],
	["Tomorrow Night Blue", "tomorrow_night_blue", "dark"],
	["Tomorrow Night Bright", "tomorrow_night_bright", "dark"],
	["Tomorrow Night 80s", "tomorrow_night_eighties", "dark"],
	["Twilight", "twilight", "dark"],
	["Vibrant Ink", "vibrant_ink", "dark"],
	["Chrome", "chrome", "light"],
	["Clouds", "clouds", "light"],
	["Crimson Editor", "crimson_editor", "light"],
	["Dawn", "dawn", "light"],
	["Dreamweaver", "dreamweaver", "light"],
	["Eclipse", "eclipse", "light"],
	["GitHub", "github", "light"],
	["IPlastic", "iplastic", "light"],
	["Solarized Light", "solarized_light", "light"],
	["TextMate", "textmate", "light"],
	["Tomorrow", "tomorrow", "light"],
	["Xcode", "xcode", "light"],
	["Kuroir", "kuroir", "light"],
	["KatzenMilch", "katzenmilch", "light"],
	["SQL Server", "sqlserver", "light"],
];

const themeLightOrDark = themeData.reduce<{ [key: string]: "light" | "dark" }>((acc, curr) => {
	acc[curr[1]] = curr[2];
	return acc;
}, {});

export {
	themeData,
	themeLightOrDark
}
