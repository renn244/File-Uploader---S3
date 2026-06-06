export function formatBytes(value: number | null, fallback?: string | null) {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return fallback ?? "Unknown size";
	}

	if (value === 0) {
		return "0 B";
	}

	const units = ["B", "KB", "MB", "GB", "TB"];
	const exponent = Math.min(
		Math.floor(Math.log(value) / Math.log(1024)),
		units.length - 1,
	);
	const formatted = value / 1024 ** exponent;

	return `${formatted >= 10 ? formatted.toFixed(0) : formatted.toFixed(1)} ${units[exponent]}`;
}

export function formatDateLabel(value: string) {
	const parsedDate = new Date(value);

	if (Number.isNaN(parsedDate.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(parsedDate);
}

export function formatCountLabel(
	count: number,
	singular: string,
	plural?: string,
) {
	return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}
