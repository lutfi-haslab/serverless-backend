// @ts-nocheck

function validateData(schema, data) {
    const errors = [];
  
    for (const key in schema) {
      const dataType = schema[key];
      const inputData = data[key];
  
      if (typeof inputData !== dataType) {
        errors.push(
          `Invalid data type for ${key}. Expected ${dataType}, but received ${typeof inputData}`
        );
      }
    }
  
    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
  }
  
  export default validateData;
  