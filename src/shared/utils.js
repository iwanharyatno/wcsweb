function truncate(string, maxLength = 100) {
    return string.length <= maxLength ? string : string.substring(0, maxLength).trim() + '...';
}

function handleErrors(msgBox, result) {
    let error;
    if (result && result.status >= 400) {
        const errors = result.data.errors || ['Failed: ' + result.status];
        errors.forEach(msg => {
            msgBox.showMessage({
                type: 'error',
                message: msg
            });
        });
        error = true;
    }
    if (!result) {
        msgBox.showMessage({
            type: 'error',
            message: 'Couldn\'t connect to the server. Please check your internet connection.'
        });
        error = true;
    }
    return error;
}

export { truncate, handleErrors };