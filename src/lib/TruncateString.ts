/**
 * Truncates a string to a maximum length, appending an ellipsis if the string is longer.
 *
 * @param value - The input string to truncate.
 * @param maxLength - The maximum length of the output string.
 * @returns The truncated string, or the original string if it is shorter than the maximum length.
 */
export const truncateString = (value: string, maxLength: number): string =>
    value.length <= maxLength ? value : value.slice(0, maxLength - 3) + "...";
