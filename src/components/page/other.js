var convert_FormData_to_json2 = function (formData) {
    var objData = {};
    
    formData.forEach((value, key) => objData[key] = value);
    
    return JSON.stringify(objData);
};

export default convert_FormData_to_json2;