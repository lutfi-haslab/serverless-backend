import { customAlphabet } from "nanoid";
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 10);
export default nanoid; //=> "NO4PcH4PQm"