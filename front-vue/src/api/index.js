import urbitAPI from "./urbitAPI";
import * as airlock from "./airlock";
import * as foundationAPI from "./foundationAPI";

export default {
  ...urbitAPI,
  ...airlock,
  ...foundationAPI,
};
