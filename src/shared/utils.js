function truncate(string, maxLength = 100) {
    return string.length <= maxLength ? string : string.substring(0, maxLength).trim() + '...';
}

export { truncate };