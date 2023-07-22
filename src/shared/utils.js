function truncate(string, maxLength = 100) {
    return string.length <= maxLength ? string : string.substring(0, maxLength).trim() + '...';
}

function handleErrors(msgBox, result) {
    let error;
    if (result && result.status >= 400) {
        const errors = (result.data.data ? result.data.data.errors : null) || (result.data.meta ? [result.data.meta.message] : [`Failed: ${result.status}`]);
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

function updateData(data, predicate, newData) {
    const updated = [...data];
    const target = data.find(predicate);
    const index = updated.findIndex(predicate);

    updated[index] = {
        ...target,
        ...newData
    };

    return updated;
}

function removeData(data, predicate) {
    const updated = [...data];
    return updated.filter((u) => !predicate(u));
}

function objectEqual(object, anotherObject) {
    const objectKeys = Object.keys(object);
    const anotherObjectKeys = Object.keys(anotherObject);
    const keys = objectKeys.length >= anotherObjectKeys.length ? objectKeys : anotherObjectKeys;

    let equal = true;

    for(let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const objectVal = object[k];
        const anotherObjectVal = anotherObject[k];

        if (objectVal && typeof(objectVal) === 'object') {
            equal = objectEqual(objectVal, anotherObjectVal);
        } else {
            equal = objectVal === anotherObjectVal;
        }

        if (!equal) return false;
    }

    return true;
}

export { truncate, handleErrors, updateData, removeData, objectEqual };