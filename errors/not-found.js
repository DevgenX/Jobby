import { StatusCodes } from "http-status-codes";
import CustomAPIErrors from "./custom-api.js";

// handles not found error status: 404
class NotFoundError extends CustomAPIErrors {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
