// Helper 

module.exports.cleanObj = (object) => {
    for (var key in object) {
        if (object[key] == '' || !object[key]) {
            delete object[key];
        }
    }
    return object;
}
