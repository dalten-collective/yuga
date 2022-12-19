import urbitAPI from "./urbitAPI";
import * as airlock from "./airlock";
import * as foundationAPI from "./foundationAPI";
import * as ramaAPI from "./ramaAPI";

export default {
  ...urbitAPI,
  ...airlock,
  ...foundationAPI,
  ...ramaAPI,
};
