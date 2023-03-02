// the parent of all the errors

class CustomAPIErrors extends Error {
  constructor(message) {
    super(message);
  }
}

export default CustomAPIErrors;
