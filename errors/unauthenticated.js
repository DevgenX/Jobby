import { StatusCodes } from "http-status-codes";
import CustomAPIErrors from "./custom-api.js";

// handles the bad request error status: 400
class UnAuthenticatedError extends CustomAPIErrors {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnAuthenticatedError;
