require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 2603:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const validator = __nccwpck_require__(1739);
const XMLParser = __nccwpck_require__(2380);
const XMLBuilder = __nccwpck_require__(660);

module.exports = {
  XMLParser: XMLParser,
  XMLValidator: validator,
  XMLBuilder: XMLBuilder
}

/***/ }),

/***/ 8280:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const nameStartChar = ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const nameChar = nameStartChar + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
const nameRegexp = '[' + nameStartChar + '][' + nameChar + ']*'
const regexName = new RegExp('^' + nameRegexp + '$');

const getAllMatches = function(string, regex) {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    const allmatches = [];
    allmatches.startIndex = regex.lastIndex - match[0].length;
    const len = match.length;
    for (let index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }
    matches.push(allmatches);
    match = regex.exec(string);
  }
  return matches;
};

const isName = function(string) {
  const match = regexName.exec(string);
  return !(match === null || typeof match === 'undefined');
};

exports.isExist = function(v) {
  return typeof v !== 'undefined';
};

exports.isEmptyObject = function(obj) {
  return Object.keys(obj).length === 0;
};

/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a
 */
exports.merge = function(target, a, arrayMode) {
  if (a) {
    const keys = Object.keys(a); // will return an array of own properties
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      if (arrayMode === 'strict') {
        target[keys[i]] = [ a[keys[i]] ];
      } else {
        target[keys[i]] = a[keys[i]];
      }
    }
  }
};
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */

exports.getValue = function(v) {
  if (exports.isExist(v)) {
    return v;
  } else {
    return '';
  }
};

// const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};

exports.isName = isName;
exports.getAllMatches = getAllMatches;
exports.nameRegexp = nameRegexp;


/***/ }),

/***/ 1739:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const util = __nccwpck_require__(8280);

const defaultOptions = {
  allowBooleanAttributes: false, //A tag can have attributes without any value
  unpairedTags: []
};

//const tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
exports.validate = function (xmlData, options) {
  options = Object.assign({}, defaultOptions, options);

  //xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
  //xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
  //xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE
  const tags = [];
  let tagFound = false;

  //indicates that the root tag has been closed (aka. depth 0 has been reached)
  let reachedRoot = false;

  if (xmlData[0] === '\ufeff') {
    // check for byte order mark (BOM)
    xmlData = xmlData.substr(1);
  }
  
  for (let i = 0; i < xmlData.length; i++) {

    if (xmlData[i] === '<' && xmlData[i+1] === '?') {
      i+=2;
      i = readPI(xmlData,i);
      if (i.err) return i;
    }else if (xmlData[i] === '<') {
      //starting of tag
      //read until you reach to '>' avoiding any '>' in attribute value
      let tagStartPos = i;
      i++;
      
      if (xmlData[i] === '!') {
        i = readCommentAndCDATA(xmlData, i);
        continue;
      } else {
        let closingTag = false;
        if (xmlData[i] === '/') {
          //closing tag
          closingTag = true;
          i++;
        }
        //read tagname
        let tagName = '';
        for (; i < xmlData.length &&
          xmlData[i] !== '>' &&
          xmlData[i] !== ' ' &&
          xmlData[i] !== '\t' &&
          xmlData[i] !== '\n' &&
          xmlData[i] !== '\r'; i++
        ) {
          tagName += xmlData[i];
        }
        tagName = tagName.trim();
        //console.log(tagName);

        if (tagName[tagName.length - 1] === '/') {
          //self closing tag without attributes
          tagName = tagName.substring(0, tagName.length - 1);
          //continue;
          i--;
        }
        if (!validateTagName(tagName)) {
          let msg;
          if (tagName.trim().length === 0) {
            msg = "Invalid space after '<'.";
          } else {
            msg = "Tag '"+tagName+"' is an invalid name.";
          }
          return getErrorObject('InvalidTag', msg, getLineNumberForPosition(xmlData, i));
        }

        const result = readAttributeStr(xmlData, i);
        if (result === false) {
          return getErrorObject('InvalidAttr', "Attributes for '"+tagName+"' have open quote.", getLineNumberForPosition(xmlData, i));
        }
        let attrStr = result.value;
        i = result.index;

        if (attrStr[attrStr.length - 1] === '/') {
          //self closing tag
          const attrStrStart = i - attrStr.length;
          attrStr = attrStr.substring(0, attrStr.length - 1);
          const isValid = validateAttributeString(attrStr, options);
          if (isValid === true) {
            tagFound = true;
            //continue; //text may presents after self closing tag
          } else {
            //the result from the nested function returns the position of the error within the attribute
            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
            //this gives us the absolute index in the entire xml, which we can use to find the line at last
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
          } else if (attrStr.trim().length > 0) {
            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
          } else {
            const otg = tags.pop();
            if (tagName !== otg.tagName) {
              let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
              return getErrorObject('InvalidTag',
                "Expected closing tag '"+otg.tagName+"' (opened in line "+openPos.line+", col "+openPos.col+") instead of closing tag '"+tagName+"'.",
                getLineNumberForPosition(xmlData, tagStartPos));
            }

            //when there are no more tags, we reached the root level.
            if (tags.length == 0) {
              reachedRoot = true;
            }
          }
        } else {
          const isValid = validateAttributeString(attrStr, options);
          if (isValid !== true) {
            //the result from the nested function returns the position of the error within the attribute
            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
            //this gives us the absolute index in the entire xml, which we can use to find the line at last
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
          }

          //if the root level has been reached before ...
          if (reachedRoot === true) {
            return getErrorObject('InvalidXml', 'Multiple possible root nodes found.', getLineNumberForPosition(xmlData, i));
          } else if(options.unpairedTags.indexOf(tagName) !== -1){
            //don't push into stack
          } else {
            tags.push({tagName, tagStartPos});
          }
          tagFound = true;
        }

        //skip tag text value
        //It may include comments and CDATA value
        for (i++; i < xmlData.length; i++) {
          if (xmlData[i] === '<') {
            if (xmlData[i + 1] === '!') {
              //comment or CADATA
              i++;
              i = readCommentAndCDATA(xmlData, i);
              continue;
            } else if (xmlData[i+1] === '?') {
              i = readPI(xmlData, ++i);
              if (i.err) return i;
            } else{
              break;
            }
          } else if (xmlData[i] === '&') {
            const afterAmp = validateAmpersand(xmlData, i);
            if (afterAmp == -1)
              return getErrorObject('InvalidChar', "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
            i = afterAmp;
          }else{
            if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
              return getErrorObject('InvalidXml', "Extra text at the end", getLineNumberForPosition(xmlData, i));
            }
          }
        } //end of reading tag text value
        if (xmlData[i] === '<') {
          i--;
        }
      }
    } else {
      if ( isWhiteSpace(xmlData[i])) {
        continue;
      }
      return getErrorObject('InvalidChar', "char '"+xmlData[i]+"' is not expected.", getLineNumberForPosition(xmlData, i));
    }
  }

  if (!tagFound) {
    return getErrorObject('InvalidXml', 'Start tag expected.', 1);
  }else if (tags.length == 1) {
      return getErrorObject('InvalidTag', "Unclosed tag '"+tags[0].tagName+"'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
  }else if (tags.length > 0) {
      return getErrorObject('InvalidXml', "Invalid '"+
          JSON.stringify(tags.map(t => t.tagName), null, 4).replace(/\r?\n/g, '')+
          "' found.", {line: 1, col: 1});
  }

  return true;
};

function isWhiteSpace(char){
  return char === ' ' || char === '\t' || char === '\n'  || char === '\r';
}
/**
 * Read Processing insstructions and skip
 * @param {*} xmlData
 * @param {*} i
 */
function readPI(xmlData, i) {
  const start = i;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] == '?' || xmlData[i] == ' ') {
      //tagname
      const tagname = xmlData.substr(start, i - start);
      if (i > 5 && tagname === 'xml') {
        return getErrorObject('InvalidXml', 'XML declaration allowed only at the start of the document.', getLineNumberForPosition(xmlData, i));
      } else if (xmlData[i] == '?' && xmlData[i + 1] == '>') {
        //check if valid attribut string
        i++;
        break;
      } else {
        continue;
      }
    }
  }
  return i;
}

function readCommentAndCDATA(xmlData, i) {
  if (xmlData.length > i + 5 && xmlData[i + 1] === '-' && xmlData[i + 2] === '-') {
    //comment
    for (i += 3; i < xmlData.length; i++) {
      if (xmlData[i] === '-' && xmlData[i + 1] === '-' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  } else if (
    xmlData.length > i + 8 &&
    xmlData[i + 1] === 'D' &&
    xmlData[i + 2] === 'O' &&
    xmlData[i + 3] === 'C' &&
    xmlData[i + 4] === 'T' &&
    xmlData[i + 5] === 'Y' &&
    xmlData[i + 6] === 'P' &&
    xmlData[i + 7] === 'E'
  ) {
    let angleBracketsCount = 1;
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === '<') {
        angleBracketsCount++;
      } else if (xmlData[i] === '>') {
        angleBracketsCount--;
        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (
    xmlData.length > i + 9 &&
    xmlData[i + 1] === '[' &&
    xmlData[i + 2] === 'C' &&
    xmlData[i + 3] === 'D' &&
    xmlData[i + 4] === 'A' &&
    xmlData[i + 5] === 'T' &&
    xmlData[i + 6] === 'A' &&
    xmlData[i + 7] === '['
  ) {
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === ']' && xmlData[i + 1] === ']' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  }

  return i;
}

const doubleQuote = '"';
const singleQuote = "'";

/**
 * Keep reading xmlData until '<' is found outside the attribute value.
 * @param {string} xmlData
 * @param {number} i
 */
function readAttributeStr(xmlData, i) {
  let attrStr = '';
  let startChar = '';
  let tagClosed = false;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
      if (startChar === '') {
        startChar = xmlData[i];
      } else if (startChar !== xmlData[i]) {
        //if vaue is enclosed with double quote then single quotes are allowed inside the value and vice versa
      } else {
        startChar = '';
      }
    } else if (xmlData[i] === '>') {
      if (startChar === '') {
        tagClosed = true;
        break;
      }
    }
    attrStr += xmlData[i];
  }
  if (startChar !== '') {
    return false;
  }

  return {
    value: attrStr,
    index: i,
    tagClosed: tagClosed
  };
}

/**
 * Select all the attributes whether valid or invalid.
 */
const validAttrStrRegxp = new RegExp('(\\s*)([^\\s=]+)(\\s*=)?(\\s*([\'"])(([\\s\\S])*?)\\5)?', 'g');

//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAttributeString(attrStr, options) {
  //console.log("start:"+attrStr+":end");

  //if(attrStr.trim().length === 0) return true; //empty string

  const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
  const attrNames = {};

  for (let i = 0; i < matches.length; i++) {
    if (matches[i][1].length === 0) {
      //nospace before attribute name: a="sd"b="saf"
      return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' has no space in starting.", getPositionFromMatch(matches[i]))
    } else if (matches[i][3] !== undefined && matches[i][4] === undefined) {
      return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' is without value.", getPositionFromMatch(matches[i]));
    } else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
      //independent attribute: ab
      return getErrorObject('InvalidAttr', "boolean attribute '"+matches[i][2]+"' is not allowed.", getPositionFromMatch(matches[i]));
    }
    /* else if(matches[i][6] === undefined){//attribute without value: ab=
                    return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
                } */
    const attrName = matches[i][2];
    if (!validateAttrName(attrName)) {
      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is an invalid name.", getPositionFromMatch(matches[i]));
    }
    if (!attrNames.hasOwnProperty(attrName)) {
      //check for duplicate attribute.
      attrNames[attrName] = 1;
    } else {
      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is repeated.", getPositionFromMatch(matches[i]));
    }
  }

  return true;
}

function validateNumberAmpersand(xmlData, i) {
  let re = /\d/;
  if (xmlData[i] === 'x') {
    i++;
    re = /[\da-fA-F]/;
  }
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === ';')
      return i;
    if (!xmlData[i].match(re))
      break;
  }
  return -1;
}

function validateAmpersand(xmlData, i) {
  // https://www.w3.org/TR/xml/#dt-charref
  i++;
  if (xmlData[i] === ';')
    return -1;
  if (xmlData[i] === '#') {
    i++;
    return validateNumberAmpersand(xmlData, i);
  }
  let count = 0;
  for (; i < xmlData.length; i++, count++) {
    if (xmlData[i].match(/\w/) && count < 20)
      continue;
    if (xmlData[i] === ';')
      break;
    return -1;
  }
  return i;
}

function getErrorObject(code, message, lineNumber) {
  return {
    err: {
      code: code,
      msg: message,
      line: lineNumber.line || lineNumber,
      col: lineNumber.col,
    },
  };
}

function validateAttrName(attrName) {
  return util.isName(attrName);
}

// const startsWithXML = /^xml/i;

function validateTagName(tagname) {
  return util.isName(tagname) /* && !tagname.match(startsWithXML) */;
}

//this function returns the line number for the character at the given index
function getLineNumberForPosition(xmlData, index) {
  const lines = xmlData.substring(0, index).split(/\r?\n/);
  return {
    line: lines.length,

    // column number is last line's length + 1, because column numbering starts at 1:
    col: lines[lines.length - 1].length + 1
  };
}

//this function returns the position of the first character of match within attrStr
function getPositionFromMatch(match) {
  return match.startIndex + match[1].length;
}


/***/ }),

/***/ 660:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

//parse Empty Node as self closing node
const buildFromOrderedJs = __nccwpck_require__(2462);

const defaultOptions = {
  attributeNamePrefix: '@_',
  attributesGroupName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  cdataPropName: false,
  format: false,
  indentBy: '  ',
  suppressEmptyNode: false,
  suppressUnpairedNode: true,
  suppressBooleanAttributes: true,
  tagValueProcessor: function(key, a) {
    return a;
  },
  attributeValueProcessor: function(attrName, a) {
    return a;
  },
  preserveOrder: false,
  commentPropName: false,
  unpairedTags: [],
  entities: [
    { regex: new RegExp("&", "g"), val: "&amp;" },//it must be on top
    { regex: new RegExp(">", "g"), val: "&gt;" },
    { regex: new RegExp("<", "g"), val: "&lt;" },
    { regex: new RegExp("\'", "g"), val: "&apos;" },
    { regex: new RegExp("\"", "g"), val: "&quot;" }
  ],
  processEntities: true,
  stopNodes: [],
  // transformTagName: false,
  // transformAttributeName: false,
  oneListGroup: false
};

function Builder(options) {
  this.options = Object.assign({}, defaultOptions, options);
  if (this.options.ignoreAttributes || this.options.attributesGroupName) {
    this.isAttribute = function(/*a*/) {
      return false;
    };
  } else {
    this.attrPrefixLen = this.options.attributeNamePrefix.length;
    this.isAttribute = isAttribute;
  }

  this.processTextOrObjNode = processTextOrObjNode

  if (this.options.format) {
    this.indentate = indentate;
    this.tagEndChar = '>\n';
    this.newLine = '\n';
  } else {
    this.indentate = function() {
      return '';
    };
    this.tagEndChar = '>';
    this.newLine = '';
  }
}

Builder.prototype.build = function(jObj) {
  if(this.options.preserveOrder){
    return buildFromOrderedJs(jObj, this.options);
  }else {
    if(Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1){
      jObj = {
        [this.options.arrayNodeName] : jObj
      }
    }
    return this.j2x(jObj, 0).val;
  }
};

Builder.prototype.j2x = function(jObj, level) {
  let attrStr = '';
  let val = '';
  for (let key in jObj) {
    if (typeof jObj[key] === 'undefined') {
      // supress undefined node only if it is not an attribute
      if (this.isAttribute(key)) {
        val += '';
      }
    } else if (jObj[key] === null) {
      // null attribute should be ignored by the attribute list, but should not cause the tag closing
      if (this.isAttribute(key)) {
        val += '';
      } else if (key[0] === '?') {
        val += this.indentate(level) + '<' + key + '?' + this.tagEndChar;
      } else {
        val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
      }
      // val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
    } else if (jObj[key] instanceof Date) {
      val += this.buildTextValNode(jObj[key], key, '', level);
    } else if (typeof jObj[key] !== 'object') {
      //premitive type
      const attr = this.isAttribute(key);
      if (attr) {
        attrStr += this.buildAttrPairStr(attr, '' + jObj[key]);
      }else {
        //tag value
        if (key === this.options.textNodeName) {
          let newval = this.options.tagValueProcessor(key, '' + jObj[key]);
          val += this.replaceEntitiesValue(newval);
        } else {
          val += this.buildTextValNode(jObj[key], key, '', level);
        }
      }
    } else if (Array.isArray(jObj[key])) {
      //repeated nodes
      const arrLen = jObj[key].length;
      let listTagVal = "";
      for (let j = 0; j < arrLen; j++) {
        const item = jObj[key][j];
        if (typeof item === 'undefined') {
          // supress undefined node
        } else if (item === null) {
          if(key[0] === "?") val += this.indentate(level) + '<' + key + '?' + this.tagEndChar;
          else val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
          // val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
        } else if (typeof item === 'object') {
          if(this.options.oneListGroup ){
            listTagVal += this.j2x(item, level + 1).val;
          }else{
            listTagVal += this.processTextOrObjNode(item, key, level)
          }
        } else {
          listTagVal += this.buildTextValNode(item, key, '', level);
        }
      }
      if(this.options.oneListGroup){
        listTagVal = this.buildObjectNode(listTagVal, key, '', level);
      }
      val += listTagVal;
    } else {
      //nested node
      if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
        const Ks = Object.keys(jObj[key]);
        const L = Ks.length;
        for (let j = 0; j < L; j++) {
          attrStr += this.buildAttrPairStr(Ks[j], '' + jObj[key][Ks[j]]);
        }
      } else {
        val += this.processTextOrObjNode(jObj[key], key, level)
      }
    }
  }
  return {attrStr: attrStr, val: val};
};

Builder.prototype.buildAttrPairStr = function(attrName, val){
  val = this.options.attributeValueProcessor(attrName, '' + val);
  val = this.replaceEntitiesValue(val);
  if (this.options.suppressBooleanAttributes && val === "true") {
    return ' ' + attrName;
  } else return ' ' + attrName + '="' + val + '"';
}

function processTextOrObjNode (object, key, level) {
  const result = this.j2x(object, level + 1);
  if (object[this.options.textNodeName] !== undefined && Object.keys(object).length === 1) {
    return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
  } else {
    return this.buildObjectNode(result.val, key, result.attrStr, level);
  }
}

Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
  if(val === ""){
    if(key[0] === "?") return  this.indentate(level) + '<' + key + attrStr+ '?' + this.tagEndChar;
    else {
      return this.indentate(level) + '<' + key + attrStr + this.closeTag(key) + this.tagEndChar;
    }
  }else{

    let tagEndExp = '</' + key + this.tagEndChar;
    let piClosingChar = "";
    
    if(key[0] === "?") {
      piClosingChar = "?";
      tagEndExp = "";
    }
  
    // attrStr is an empty string in case the attribute came as undefined or null
    if ((attrStr || attrStr === '') && val.indexOf('<') === -1) {
      return ( this.indentate(level) + '<' +  key + attrStr + piClosingChar + '>' + val + tagEndExp );
    } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
      return this.indentate(level) + `<!--${val}-->` + this.newLine;
    }else {
      return (
        this.indentate(level) + '<' + key + attrStr + piClosingChar + this.tagEndChar +
        val +
        this.indentate(level) + tagEndExp    );
    }
  }
}

Builder.prototype.closeTag = function(key){
  let closeTag = "";
  if(this.options.unpairedTags.indexOf(key) !== -1){ //unpaired
    if(!this.options.suppressUnpairedNode) closeTag = "/"
  }else if(this.options.suppressEmptyNode){ //empty
    closeTag = "/";
  }else{
    closeTag = `></${key}`
  }
  return closeTag;
}

function buildEmptyObjNode(val, key, attrStr, level) {
  if (val !== '') {
    return this.buildObjectNode(val, key, attrStr, level);
  } else {
    if(key[0] === "?") return  this.indentate(level) + '<' + key + attrStr+ '?' + this.tagEndChar;
    else {
      return  this.indentate(level) + '<' + key + attrStr + '/' + this.tagEndChar;
      // return this.buildTagStr(level,key, attrStr);
    }
  }
}

Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
  if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
    return this.indentate(level) + `<![CDATA[${val}]]>` +  this.newLine;
  }else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
    return this.indentate(level) + `<!--${val}-->` +  this.newLine;
  }else if(key[0] === "?") {//PI tag
    return  this.indentate(level) + '<' + key + attrStr+ '?' + this.tagEndChar; 
  }else{
    let textValue = this.options.tagValueProcessor(key, val);
    textValue = this.replaceEntitiesValue(textValue);
  
    if( textValue === ''){
      return this.indentate(level) + '<' + key + attrStr + this.closeTag(key) + this.tagEndChar;
    }else{
      return this.indentate(level) + '<' + key + attrStr + '>' +
         textValue +
        '</' + key + this.tagEndChar;
    }
  }
}

Builder.prototype.replaceEntitiesValue = function(textValue){
  if(textValue && textValue.length > 0 && this.options.processEntities){
    for (let i=0; i<this.options.entities.length; i++) {
      const entity = this.options.entities[i];
      textValue = textValue.replace(entity.regex, entity.val);
    }
  }
  return textValue;
}

function indentate(level) {
  return this.options.indentBy.repeat(level);
}

function isAttribute(name /*, options*/) {
  if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
    return name.substr(this.attrPrefixLen);
  } else {
    return false;
  }
}

module.exports = Builder;


/***/ }),

/***/ 2462:
/***/ ((module) => {

const EOL = "\n";

/**
 * 
 * @param {array} jArray 
 * @param {any} options 
 * @returns 
 */
function toXml(jArray, options) {
    let indentation = "";
    if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
    }
    return arrToStr(jArray, options, "", indentation);
}

function arrToStr(arr, options, jPath, indentation) {
    let xmlStr = "";
    let isPreviousElementTag = false;

    for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const tagName = propName(tagObj);
        let newJPath = "";
        if (jPath.length === 0) newJPath = tagName
        else newJPath = `${jPath}.${tagName}`;

        if (tagName === options.textNodeName) {
            let tagText = tagObj[tagName];
            if (!isStopNode(newJPath, options)) {
                tagText = options.tagValueProcessor(tagName, tagText);
                tagText = replaceEntitiesValue(tagText, options);
            }
            if (isPreviousElementTag) {
                xmlStr += indentation;
            }
            xmlStr += tagText;
            isPreviousElementTag = false;
            continue;
        } else if (tagName === options.cdataPropName) {
            if (isPreviousElementTag) {
                xmlStr += indentation;
            }
            xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
            isPreviousElementTag = false;
            continue;
        } else if (tagName === options.commentPropName) {
            xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
            isPreviousElementTag = true;
            continue;
        } else if (tagName[0] === "?") {
            const attStr = attr_to_str(tagObj[":@"], options);
            const tempInd = tagName === "?xml" ? "" : indentation;
            let piTextNodeName = tagObj[tagName][0][options.textNodeName];
            piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : ""; //remove extra spacing
            xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr}?>`;
            isPreviousElementTag = true;
            continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
            newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
            if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
            else xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
            xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
            xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
            xmlStr += tagStart + ">";
            if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
                xmlStr += indentation + options.indentBy + tagValue + indentation;
            } else {
                xmlStr += tagValue;
            }
            xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
    }

    return xmlStr;
}

function propName(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== ":@") return key;
    }
}

function attr_to_str(attrMap, options) {
    let attrStr = "";
    if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
            let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
            attrVal = replaceEntitiesValue(attrVal, options);
            if (attrVal === true && options.suppressBooleanAttributes) {
                attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
            } else {
                attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
            }
        }
    }
    return attrStr;
}

function isStopNode(jPath, options) {
    jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
    let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
    for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
    }
    return false;
}

function replaceEntitiesValue(textValue, options) {
    if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i = 0; i < options.entities.length; i++) {
            const entity = options.entities[i];
            textValue = textValue.replace(entity.regex, entity.val);
        }
    }
    return textValue;
}
module.exports = toXml;


/***/ }),

/***/ 6072:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const util = __nccwpck_require__(8280);

//TODO: handle comments
function readDocType(xmlData, i){
    
    const entities = {};
    if( xmlData[i + 3] === 'O' &&
         xmlData[i + 4] === 'C' &&
         xmlData[i + 5] === 'T' &&
         xmlData[i + 6] === 'Y' &&
         xmlData[i + 7] === 'P' &&
         xmlData[i + 8] === 'E')
    {    
        i = i+9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for(;i<xmlData.length;i++){
            if (xmlData[i] === '<' && !comment) { //Determine the tag type
                if( hasBody && isEntity(xmlData, i)){
                    i += 7; 
                    [entityName, val,i] = readEntityExp(xmlData,i+1);
                    if(val.indexOf("&") === -1) //Parameter entities are not supported
                        entities[ validateEntityName(entityName) ] = {
                            regx : RegExp( `&${entityName};`,"g"),
                            val: val
                        };
                }
                else if( hasBody && isElement(xmlData, i))  i += 8;//Not supported
                else if( hasBody && isAttlist(xmlData, i))  i += 8;//Not supported
                else if( hasBody && isNotation(xmlData, i)) i += 9;//Not supported
                else if( isComment)                         comment = true;
                else                                        throw new Error("Invalid DOCTYPE");

                angleBracketsCount++;
                exp = "";
            } else if (xmlData[i] === '>') { //Read tag content
                if(comment){
                    if( xmlData[i - 1] === "-" && xmlData[i - 2] === "-"){
                        comment = false;
                        angleBracketsCount--;
                    }
                }else{
                    angleBracketsCount--;
                }
                if (angleBracketsCount === 0) {
                  break;
                }
            }else if( xmlData[i] === '['){
                hasBody = true;
            }else{
                exp += xmlData[i];
            }
        }
        if(angleBracketsCount !== 0){
            throw new Error(`Unclosed DOCTYPE`);
        }
    }else{
        throw new Error(`Invalid Tag instead of DOCTYPE`);
    }
    return {entities, i};
}

function readEntityExp(xmlData,i){
    //External entities are not supported
    //    <!ENTITY ext SYSTEM "http://normal-website.com" >

    //Parameter entities are not supported
    //    <!ENTITY entityname "&anotherElement;">

    //Internal entities are supported
    //    <!ENTITY entityname "replacement text">
    
    //read EntityName
    let entityName = "";
    for (; i < xmlData.length && (xmlData[i] !== "'" && xmlData[i] !== '"' ); i++) {
        // if(xmlData[i] === " ") continue;
        // else 
        entityName += xmlData[i];
    }
    entityName = entityName.trim();
    if(entityName.indexOf(" ") !== -1) throw new Error("External entites are not supported");

    //read Entity Value
    const startChar = xmlData[i++];
    let val = ""
    for (; i < xmlData.length && xmlData[i] !== startChar ; i++) {
        val += xmlData[i];
    }
    return [entityName, val, i];
}

function isComment(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === '-' &&
    xmlData[i+3] === '-') return true
    return false
}
function isEntity(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === 'E' &&
    xmlData[i+3] === 'N' &&
    xmlData[i+4] === 'T' &&
    xmlData[i+5] === 'I' &&
    xmlData[i+6] === 'T' &&
    xmlData[i+7] === 'Y') return true
    return false
}
function isElement(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === 'E' &&
    xmlData[i+3] === 'L' &&
    xmlData[i+4] === 'E' &&
    xmlData[i+5] === 'M' &&
    xmlData[i+6] === 'E' &&
    xmlData[i+7] === 'N' &&
    xmlData[i+8] === 'T') return true
    return false
}

function isAttlist(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === 'A' &&
    xmlData[i+3] === 'T' &&
    xmlData[i+4] === 'T' &&
    xmlData[i+5] === 'L' &&
    xmlData[i+6] === 'I' &&
    xmlData[i+7] === 'S' &&
    xmlData[i+8] === 'T') return true
    return false
}
function isNotation(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === 'N' &&
    xmlData[i+3] === 'O' &&
    xmlData[i+4] === 'T' &&
    xmlData[i+5] === 'A' &&
    xmlData[i+6] === 'T' &&
    xmlData[i+7] === 'I' &&
    xmlData[i+8] === 'O' &&
    xmlData[i+9] === 'N') return true
    return false
}

function validateEntityName(name){
    if (util.isName(name))
	return name;
    else
        throw new Error(`Invalid entity name ${name}`);
}

module.exports = readDocType;


/***/ }),

/***/ 6993:
/***/ ((__unused_webpack_module, exports) => {


const defaultOptions = {
    preserveOrder: false,
    attributeNamePrefix: '@_',
    attributesGroupName: false,
    textNodeName: '#text',
    ignoreAttributes: true,
    removeNSPrefix: false, // remove NS from tag name or attribute name if true
    allowBooleanAttributes: false, //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true, //Trim string values of tag and attributes
    cdataPropName: false,
    numberParseOptions: {
      hex: true,
      leadingZeros: true,
      eNotation: true
    },
    tagValueProcessor: function(tagName, val) {
      return val;
    },
    attributeValueProcessor: function(attrName, val) {
      return val;
    },
    stopNodes: [], //nested tags will not be parsed even for errors
    alwaysCreateTextNode: false,
    isArray: () => false,
    commentPropName: false,
    unpairedTags: [],
    processEntities: true,
    htmlEntities: false,
    ignoreDeclaration: false,
    ignorePiTags: false,
    transformTagName: false,
    transformAttributeName: false,
    updateTag: function(tagName, jPath, attrs){
      return tagName
    },
    // skipEmptyListItem: false
};
   
const buildOptions = function(options) {
    return Object.assign({}, defaultOptions, options);
};

exports.buildOptions = buildOptions;
exports.defaultOptions = defaultOptions;

/***/ }),

/***/ 5832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

///@ts-check

const util = __nccwpck_require__(8280);
const xmlNode = __nccwpck_require__(7462);
const readDocType = __nccwpck_require__(6072);
const toNumber = __nccwpck_require__(4526);

const regx =
  '<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)'
  .replace(/NAME/g, util.nameRegexp);

//const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
//const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");

class OrderedObjParser{
  constructor(options){
    this.options = options;
    this.currentNode = null;
    this.tagsNodeStack = [];
    this.docTypeEntities = {};
    this.lastEntities = {
      "apos" : { regex: /&(apos|#39|#x27);/g, val : "'"},
      "gt" : { regex: /&(gt|#62|#x3E);/g, val : ">"},
      "lt" : { regex: /&(lt|#60|#x3C);/g, val : "<"},
      "quot" : { regex: /&(quot|#34|#x22);/g, val : "\""},
    };
    this.ampEntity = { regex: /&(amp|#38|#x26);/g, val : "&"};
    this.htmlEntities = {
      "space": { regex: /&(nbsp|#160);/g, val: " " },
      // "lt" : { regex: /&(lt|#60);/g, val: "<" },
      // "gt" : { regex: /&(gt|#62);/g, val: ">" },
      // "amp" : { regex: /&(amp|#38);/g, val: "&" },
      // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
      // "apos" : { regex: /&(apos|#39);/g, val: "'" },
      "cent" : { regex: /&(cent|#162);/g, val: "¢" },
      "pound" : { regex: /&(pound|#163);/g, val: "£" },
      "yen" : { regex: /&(yen|#165);/g, val: "¥" },
      "euro" : { regex: /&(euro|#8364);/g, val: "€" },
      "copyright" : { regex: /&(copy|#169);/g, val: "©" },
      "reg" : { regex: /&(reg|#174);/g, val: "®" },
      "inr" : { regex: /&(inr|#8377);/g, val: "₹" },
    };
    this.addExternalEntities = addExternalEntities;
    this.parseXml = parseXml;
    this.parseTextData = parseTextData;
    this.resolveNameSpace = resolveNameSpace;
    this.buildAttributesMap = buildAttributesMap;
    this.isItStopNode = isItStopNode;
    this.replaceEntitiesValue = replaceEntitiesValue;
    this.readStopNodeData = readStopNodeData;
    this.saveTextToParentTag = saveTextToParentTag;
    this.addChild = addChild;
  }

}

function addExternalEntities(externalEntities){
  const entKeys = Object.keys(externalEntities);
  for (let i = 0; i < entKeys.length; i++) {
    const ent = entKeys[i];
    this.lastEntities[ent] = {
       regex: new RegExp("&"+ent+";","g"),
       val : externalEntities[ent]
    }
  }
}

/**
 * @param {string} val
 * @param {string} tagName
 * @param {string} jPath
 * @param {boolean} dontTrim
 * @param {boolean} hasAttributes
 * @param {boolean} isLeafNode
 * @param {boolean} escapeEntities
 */
function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
  if (val !== undefined) {
    if (this.options.trimValues && !dontTrim) {
      val = val.trim();
    }
    if(val.length > 0){
      if(!escapeEntities) val = this.replaceEntitiesValue(val);
      
      const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
      if(newval === null || newval === undefined){
        //don't parse
        return val;
      }else if(typeof newval !== typeof val || newval !== val){
        //overwrite
        return newval;
      }else if(this.options.trimValues){
        return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
      }else{
        const trimmedVal = val.trim();
        if(trimmedVal === val){
          return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
        }else{
          return val;
        }
      }
    }
  }
}

function resolveNameSpace(tagname) {
  if (this.options.removeNSPrefix) {
    const tags = tagname.split(':');
    const prefix = tagname.charAt(0) === '/' ? '/' : '';
    if (tags[0] === 'xmlns') {
      return '';
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}

//TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
const attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])([\\s\\S]*?)\\3)?', 'gm');

function buildAttributesMap(attrStr, jPath, tagName) {
  if (!this.options.ignoreAttributes && typeof attrStr === 'string') {
    // attrStr = attrStr.replace(/\r?\n/g, ' ');
    //attrStr = attrStr || attrStr.trim();

    const matches = util.getAllMatches(attrStr, attrsRegx);
    const len = matches.length; //don't make it inline
    const attrs = {};
    for (let i = 0; i < len; i++) {
      const attrName = this.resolveNameSpace(matches[i][1]);
      let oldVal = matches[i][4];
      let aName = this.options.attributeNamePrefix + attrName;
      if (attrName.length) {
        if (this.options.transformAttributeName) {
          aName = this.options.transformAttributeName(aName);
        }
        if(aName === "__proto__") aName  = "#__proto__";
        if (oldVal !== undefined) {
          if (this.options.trimValues) {
            oldVal = oldVal.trim();
          }
          oldVal = this.replaceEntitiesValue(oldVal);
          const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
          if(newVal === null || newVal === undefined){
            //don't parse
            attrs[aName] = oldVal;
          }else if(typeof newVal !== typeof oldVal || newVal !== oldVal){
            //overwrite
            attrs[aName] = newVal;
          }else{
            //parse
            attrs[aName] = parseValue(
              oldVal,
              this.options.parseAttributeValue,
              this.options.numberParseOptions
            );
          }
        } else if (this.options.allowBooleanAttributes) {
          attrs[aName] = true;
        }
      }
    }
    if (!Object.keys(attrs).length) {
      return;
    }
    if (this.options.attributesGroupName) {
      const attrCollection = {};
      attrCollection[this.options.attributesGroupName] = attrs;
      return attrCollection;
    }
    return attrs
  }
}

const parseXml = function(xmlData) {
  xmlData = xmlData.replace(/\r\n?/g, "\n"); //TODO: remove this line
  const xmlObj = new xmlNode('!xml');
  let currentNode = xmlObj;
  let textData = "";
  let jPath = "";
  for(let i=0; i< xmlData.length; i++){//for each char in XML data
    const ch = xmlData[i];
    if(ch === '<'){
      // const nextIndex = i+1;
      // const _2ndChar = xmlData[nextIndex];
      if( xmlData[i+1] === '/') {//Closing Tag
        const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.")
        let tagName = xmlData.substring(i+2,closeIndex).trim();

        if(this.options.removeNSPrefix){
          const colonIndex = tagName.indexOf(":");
          if(colonIndex !== -1){
            tagName = tagName.substr(colonIndex+1);
          }
        }

        if(this.options.transformTagName) {
          tagName = this.options.transformTagName(tagName);
        }

        if(currentNode){
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
        }

        //check if last tag of nested tag was unpaired tag
        const lastTagName = jPath.substring(jPath.lastIndexOf(".")+1);
        if(tagName && this.options.unpairedTags.indexOf(tagName) !== -1 ){
          throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
        }
        let propIndex = 0
        if(lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1 ){
          propIndex = jPath.lastIndexOf('.', jPath.lastIndexOf('.')-1)
          this.tagsNodeStack.pop();
        }else{
          propIndex = jPath.lastIndexOf(".");
        }
        jPath = jPath.substring(0, propIndex);

        currentNode = this.tagsNodeStack.pop();//avoid recursion, set the parent tag scope
        textData = "";
        i = closeIndex;
      } else if( xmlData[i+1] === '?') {

        let tagData = readTagExp(xmlData,i, false, "?>");
        if(!tagData) throw new Error("Pi Tag is not closed.");

        textData = this.saveTextToParentTag(textData, currentNode, jPath);
        if( (this.options.ignoreDeclaration && tagData.tagName === "?xml") || this.options.ignorePiTags){

        }else{
  
          const childNode = new xmlNode(tagData.tagName);
          childNode.add(this.options.textNodeName, "");
          
          if(tagData.tagName !== tagData.tagExp && tagData.attrExpPresent){
            childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
          }
          this.addChild(currentNode, childNode, jPath)

        }


        i = tagData.closeIndex + 1;
      } else if(xmlData.substr(i + 1, 3) === '!--') {
        const endIndex = findClosingIndex(xmlData, "-->", i+4, "Comment is not closed.")
        if(this.options.commentPropName){
          const comment = xmlData.substring(i + 4, endIndex - 2);

          textData = this.saveTextToParentTag(textData, currentNode, jPath);

          currentNode.add(this.options.commentPropName, [ { [this.options.textNodeName] : comment } ]);
        }
        i = endIndex;
      } else if( xmlData.substr(i + 1, 2) === '!D') {
        const result = readDocType(xmlData, i);
        this.docTypeEntities = result.entities;
        i = result.i;
      }else if(xmlData.substr(i + 1, 2) === '![') {
        const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
        const tagExp = xmlData.substring(i + 9,closeIndex);

        textData = this.saveTextToParentTag(textData, currentNode, jPath);

        //cdata should be set even if it is 0 length string
        if(this.options.cdataPropName){
          // let val = this.parseTextData(tagExp, this.options.cdataPropName, jPath + "." + this.options.cdataPropName, true, false, true);
          // if(!val) val = "";
          currentNode.add(this.options.cdataPropName, [ { [this.options.textNodeName] : tagExp } ]);
        }else{
          let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true);
          if(val == undefined) val = "";
          currentNode.add(this.options.textNodeName, val);
        }
        
        i = closeIndex + 2;
      }else {//Opening tag
        let result = readTagExp(xmlData,i, this.options.removeNSPrefix);
        let tagName= result.tagName;
        let tagExp = result.tagExp;
        let attrExpPresent = result.attrExpPresent;
        let closeIndex = result.closeIndex;

        if (this.options.transformTagName) {
          tagName = this.options.transformTagName(tagName);
        }
        
        //save text as child node
        if (currentNode && textData) {
          if(currentNode.tagname !== '!xml'){
            //when nested tag is found
            textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
          }
        }

        //check if last tag was unpaired tag
        const lastTag = currentNode;
        if(lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1 ){
          currentNode = this.tagsNodeStack.pop();
          jPath = jPath.substring(0, jPath.lastIndexOf("."));
        }
        if(tagName !== xmlObj.tagname){
          jPath += jPath ? "." + tagName : tagName;
        }
        if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) { //TODO: namespace
          let tagContent = "";
          //self-closing tag
          if(tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1){
            i = result.closeIndex;
          }
          //unpaired tag
          else if(this.options.unpairedTags.indexOf(tagName) !== -1){
            i = result.closeIndex;
          }
          //normal tag
          else{
            //read until closing tag is found
            const result = this.readStopNodeData(xmlData, tagName, closeIndex + 1);
            if(!result) throw new Error(`Unexpected end of ${tagName}`);
            i = result.i;
            tagContent = result.tagContent;
          }

          const childNode = new xmlNode(tagName);
          if(tagName !== tagExp && attrExpPresent){
            childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
          }
          if(tagContent) {
            tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
          }
          
          jPath = jPath.substr(0, jPath.lastIndexOf("."));
          childNode.add(this.options.textNodeName, tagContent);
          
          this.addChild(currentNode, childNode, jPath)
        }else{
  //selfClosing tag
          if(tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1){
            if(tagName[tagName.length - 1] === "/"){ //remove trailing '/'
              tagName = tagName.substr(0, tagName.length - 1);
              jPath = jPath.substr(0, jPath.length - 1);
              tagExp = tagName;
            }else{
              tagExp = tagExp.substr(0, tagExp.length - 1);
            }
            
            if(this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }

            const childNode = new xmlNode(tagName);
            if(tagName !== tagExp && attrExpPresent){
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            this.addChild(currentNode, childNode, jPath)
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
          }
    //opening tag
          else{
            const childNode = new xmlNode( tagName);
            this.tagsNodeStack.push(currentNode);
            
            if(tagName !== tagExp && attrExpPresent){
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            this.addChild(currentNode, childNode, jPath)
            currentNode = childNode;
          }
          textData = "";
          i = closeIndex;
        }
      }
    }else{
      textData += xmlData[i];
    }
  }
  return xmlObj.child;
}

function addChild(currentNode, childNode, jPath){
  const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"])
  if(result === false){
  }else if(typeof result === "string"){
    childNode.tagname = result
    currentNode.addChild(childNode);
  }else{
    currentNode.addChild(childNode);
  }
}

const replaceEntitiesValue = function(val){

  if(this.options.processEntities){
    for(let entityName in this.docTypeEntities){
      const entity = this.docTypeEntities[entityName];
      val = val.replace( entity.regx, entity.val);
    }
    for(let entityName in this.lastEntities){
      const entity = this.lastEntities[entityName];
      val = val.replace( entity.regex, entity.val);
    }
    if(this.options.htmlEntities){
      for(let entityName in this.htmlEntities){
        const entity = this.htmlEntities[entityName];
        val = val.replace( entity.regex, entity.val);
      }
    }
    val = val.replace( this.ampEntity.regex, this.ampEntity.val);
  }
  return val;
}
function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
  if (textData) { //store previously collected data as textNode
    if(isLeafNode === undefined) isLeafNode = Object.keys(currentNode.child).length === 0
    
    textData = this.parseTextData(textData,
      currentNode.tagname,
      jPath,
      false,
      currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
      isLeafNode);

    if (textData !== undefined && textData !== "")
      currentNode.add(this.options.textNodeName, textData);
    textData = "";
  }
  return textData;
}

//TODO: use jPath to simplify the logic
/**
 * 
 * @param {string[]} stopNodes 
 * @param {string} jPath
 * @param {string} currentTagName 
 */
function isItStopNode(stopNodes, jPath, currentTagName){
  const allNodesExp = "*." + currentTagName;
  for (const stopNodePath in stopNodes) {
    const stopNodeExp = stopNodes[stopNodePath];
    if( allNodesExp === stopNodeExp || jPath === stopNodeExp  ) return true;
  }
  return false;
}

/**
 * Returns the tag Expression and where it is ending handling single-double quotes situation
 * @param {string} xmlData 
 * @param {number} i starting index
 * @returns 
 */
function tagExpWithClosingIndex(xmlData, i, closingChar = ">"){
  let attrBoundary;
  let tagExp = "";
  for (let index = i; index < xmlData.length; index++) {
    let ch = xmlData[index];
    if (attrBoundary) {
        if (ch === attrBoundary) attrBoundary = "";//reset
    } else if (ch === '"' || ch === "'") {
        attrBoundary = ch;
    } else if (ch === closingChar[0]) {
      if(closingChar[1]){
        if(xmlData[index + 1] === closingChar[1]){
          return {
            data: tagExp,
            index: index
          }
        }
      }else{
        return {
          data: tagExp,
          index: index
        }
      }
    } else if (ch === '\t') {
      ch = " "
    }
    tagExp += ch;
  }
}

function findClosingIndex(xmlData, str, i, errMsg){
  const closingIndex = xmlData.indexOf(str, i);
  if(closingIndex === -1){
    throw new Error(errMsg)
  }else{
    return closingIndex + str.length - 1;
  }
}

function readTagExp(xmlData,i, removeNSPrefix, closingChar = ">"){
  const result = tagExpWithClosingIndex(xmlData, i+1, closingChar);
  if(!result) return;
  let tagExp = result.data;
  const closeIndex = result.index;
  const separatorIndex = tagExp.search(/\s/);
  let tagName = tagExp;
  let attrExpPresent = true;
  if(separatorIndex !== -1){//separate tag name and attributes expression
    tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, '');
    tagExp = tagExp.substr(separatorIndex + 1);
  }

  if(removeNSPrefix){
    const colonIndex = tagName.indexOf(":");
    if(colonIndex !== -1){
      tagName = tagName.substr(colonIndex+1);
      attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
    }
  }

  return {
    tagName: tagName,
    tagExp: tagExp,
    closeIndex: closeIndex,
    attrExpPresent: attrExpPresent,
  }
}
/**
 * find paired tag for a stop node
 * @param {string} xmlData 
 * @param {string} tagName 
 * @param {number} i 
 */
function readStopNodeData(xmlData, tagName, i){
  const startIndex = i;
  // Starting at 1 since we already have an open tag
  let openTagCount = 1;

  for (; i < xmlData.length; i++) {
    if( xmlData[i] === "<"){ 
      if (xmlData[i+1] === "/") {//close tag
          const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
          let closeTagName = xmlData.substring(i+2,closeIndex).trim();
          if(closeTagName === tagName){
            openTagCount--;
            if (openTagCount === 0) {
              return {
                tagContent: xmlData.substring(startIndex, i),
                i : closeIndex
              }
            }
          }
          i=closeIndex;
        } else if(xmlData[i+1] === '?') { 
          const closeIndex = findClosingIndex(xmlData, "?>", i+1, "StopNode is not closed.")
          i=closeIndex;
        } else if(xmlData.substr(i + 1, 3) === '!--') { 
          const closeIndex = findClosingIndex(xmlData, "-->", i+3, "StopNode is not closed.")
          i=closeIndex;
        } else if(xmlData.substr(i + 1, 2) === '![') { 
          const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
          i=closeIndex;
        } else {
          const tagData = readTagExp(xmlData, i, '>')

          if (tagData) {
            const openTagName = tagData && tagData.tagName;
            if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length-1] !== "/") {
              openTagCount++;
            }
            i=tagData.closeIndex;
          }
        }
      }
  }//end for loop
}

function parseValue(val, shouldParse, options) {
  if (shouldParse && typeof val === 'string') {
    //console.log(options)
    const newval = val.trim();
    if(newval === 'true' ) return true;
    else if(newval === 'false' ) return false;
    else return toNumber(val, options);
  } else {
    if (util.isExist(val)) {
      return val;
    } else {
      return '';
    }
  }
}


module.exports = OrderedObjParser;


/***/ }),

/***/ 2380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { buildOptions} = __nccwpck_require__(6993);
const OrderedObjParser = __nccwpck_require__(5832);
const { prettify} = __nccwpck_require__(2882);
const validator = __nccwpck_require__(1739);

class XMLParser{
    
    constructor(options){
        this.externalEntities = {};
        this.options = buildOptions(options);
        
    }
    /**
     * Parse XML dats to JS object 
     * @param {string|Buffer} xmlData 
     * @param {boolean|Object} validationOption 
     */
    parse(xmlData,validationOption){
        if(typeof xmlData === "string"){
        }else if( xmlData.toString){
            xmlData = xmlData.toString();
        }else{
            throw new Error("XML data is accepted in String or Bytes[] form.")
        }
        if( validationOption){
            if(validationOption === true) validationOption = {}; //validate with default options
            
            const result = validator.validate(xmlData, validationOption);
            if (result !== true) {
              throw Error( `${result.err.msg}:${result.err.line}:${result.err.col}` )
            }
          }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if(this.options.preserveOrder || orderedResult === undefined) return orderedResult;
        else return prettify(orderedResult, this.options);
    }

    /**
     * Add Entity which is not by default supported by this library
     * @param {string} key 
     * @param {string} value 
     */
    addEntity(key, value){
        if(value.indexOf("&") !== -1){
            throw new Error("Entity value can't have '&'")
        }else if(key.indexOf("&") !== -1 || key.indexOf(";") !== -1){
            throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'")
        }else if(value === "&"){
            throw new Error("An entity with value '&' is not permitted");
        }else{
            this.externalEntities[key] = value;
        }
    }
}

module.exports = XMLParser;

/***/ }),

/***/ 2882:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * 
 * @param {array} node 
 * @param {any} options 
 * @returns 
 */
function prettify(node, options){
  return compress( node, options);
}

/**
 * 
 * @param {array} arr 
 * @param {object} options 
 * @param {string} jPath 
 * @returns object
 */
function compress(arr, options, jPath){
  let text;
  const compressedObj = {};
  for (let i = 0; i < arr.length; i++) {
    const tagObj = arr[i];
    const property = propName(tagObj);
    let newJpath = "";
    if(jPath === undefined) newJpath = property;
    else newJpath = jPath + "." + property;

    if(property === options.textNodeName){
      if(text === undefined) text = tagObj[property];
      else text += "" + tagObj[property];
    }else if(property === undefined){
      continue;
    }else if(tagObj[property]){
      
      let val = compress(tagObj[property], options, newJpath);
      const isLeaf = isLeafTag(val, options);

      if(tagObj[":@"]){
        assignAttributes( val, tagObj[":@"], newJpath, options);
      }else if(Object.keys(val).length === 1 && val[options.textNodeName] !== undefined && !options.alwaysCreateTextNode){
        val = val[options.textNodeName];
      }else if(Object.keys(val).length === 0){
        if(options.alwaysCreateTextNode) val[options.textNodeName] = "";
        else val = "";
      }

      if(compressedObj[property] !== undefined && compressedObj.hasOwnProperty(property)) {
        if(!Array.isArray(compressedObj[property])) {
            compressedObj[property] = [ compressedObj[property] ];
        }
        compressedObj[property].push(val);
      }else{
        //TODO: if a node is not an array, then check if it should be an array
        //also determine if it is a leaf node
        if (options.isArray(property, newJpath, isLeaf )) {
          compressedObj[property] = [val];
        }else{
          compressedObj[property] = val;
        }
      }
    }
    
  }
  // if(text && text.length > 0) compressedObj[options.textNodeName] = text;
  if(typeof text === "string"){
    if(text.length > 0) compressedObj[options.textNodeName] = text;
  }else if(text !== undefined) compressedObj[options.textNodeName] = text;
  return compressedObj;
}

function propName(obj){
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if(key !== ":@") return key;
  }
}

function assignAttributes(obj, attrMap, jpath, options){
  if (attrMap) {
    const keys = Object.keys(attrMap);
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      const atrrName = keys[i];
      if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
        obj[atrrName] = [ attrMap[atrrName] ];
      } else {
        obj[atrrName] = attrMap[atrrName];
      }
    }
  }
}

function isLeafTag(obj, options){
  const { textNodeName } = options;
  const propCount = Object.keys(obj).length;
  
  if (propCount === 0) {
    return true;
  }

  if (
    propCount === 1 &&
    (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)
  ) {
    return true;
  }

  return false;
}
exports.prettify = prettify;


/***/ }),

/***/ 7462:
/***/ ((module) => {

"use strict";


class XmlNode{
  constructor(tagname) {
    this.tagname = tagname;
    this.child = []; //nested tags, text, cdata, comments in order
    this[":@"] = {}; //attributes map
  }
  add(key,val){
    // this.child.push( {name : key, val: val, isCdata: isCdata });
    if(key === "__proto__") key = "#__proto__";
    this.child.push( {[key]: val });
  }
  addChild(node) {
    if(node.tagname === "__proto__") node.tagname = "#__proto__";
    if(node[":@"] && Object.keys(node[":@"]).length > 0){
      this.child.push( { [node.tagname]: node.child, [":@"]: node[":@"] });
    }else{
      this.child.push( { [node.tagname]: node.child });
    }
  };
};


module.exports = XmlNode;

/***/ }),

/***/ 4526:
/***/ ((module) => {

const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
const numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
// const octRegex = /0x[a-z0-9]+/;
// const binRegex = /0x[a-z0-9]+/;


//polyfill
if (!Number.parseInt && window.parseInt) {
    Number.parseInt = window.parseInt;
}
if (!Number.parseFloat && window.parseFloat) {
    Number.parseFloat = window.parseFloat;
}

  
const consider = {
    hex :  true,
    leadingZeros: true,
    decimalPoint: "\.",
    eNotation: true
    //skipLike: /regex/
};

function toNumber(str, options = {}){
    // const options = Object.assign({}, consider);
    // if(opt.leadingZeros === false){
    //     options.leadingZeros = false;
    // }else if(opt.hex === false){
    //     options.hex = false;
    // }

    options = Object.assign({}, consider, options );
    if(!str || typeof str !== "string" ) return str;
    
    let trimmedStr  = str.trim();
    // if(trimmedStr === "0.0") return 0;
    // else if(trimmedStr === "+0.0") return 0;
    // else if(trimmedStr === "-0.0") return -0;

    if(options.skipLike !== undefined && options.skipLike.test(trimmedStr)) return str;
    else if (options.hex && hexRegex.test(trimmedStr)) {
        return Number.parseInt(trimmedStr, 16);
    // } else if (options.parseOct && octRegex.test(str)) {
    //     return Number.parseInt(val, 8);
    // }else if (options.parseBin && binRegex.test(str)) {
    //     return Number.parseInt(val, 2);
    }else{
        //separate negative sign, leading zeros, and rest number
        const match = numRegex.exec(trimmedStr);
        if(match){
            const sign = match[1];
            const leadingZeros = match[2];
            let numTrimmedByZeros = trimZeros(match[3]); //complete num without leading zeros
            //trim ending zeros for floating number
            
            const eNotation = match[4] || match[6];
            if(!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str; //-0123
            else if(!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str; //0123
            else{//no leading zeros or leading zeros are allowed
                const num = Number(trimmedStr);
                const numStr = "" + num;
                if(numStr.search(/[eE]/) !== -1){ //given number is long and parsed to eNotation
                    if(options.eNotation) return num;
                    else return str;
                }else if(eNotation){ //given number has enotation
                    if(options.eNotation) return num;
                    else return str;
                }else if(trimmedStr.indexOf(".") !== -1){ //floating number
                    // const decimalPart = match[5].substr(1);
                    // const intPart = trimmedStr.substr(0,trimmedStr.indexOf("."));

                    
                    // const p = numStr.indexOf(".");
                    // const givenIntPart = numStr.substr(0,p);
                    // const givenDecPart = numStr.substr(p+1);
                    if(numStr === "0" && (numTrimmedByZeros === "") ) return num; //0.0
                    else if(numStr === numTrimmedByZeros) return num; //0.456. 0.79000
                    else if( sign && numStr === "-"+numTrimmedByZeros) return num;
                    else return str;
                }
                
                if(leadingZeros){
                    // if(numTrimmedByZeros === numStr){
                    //     if(options.leadingZeros) return num;
                    //     else return str;
                    // }else return str;
                    if(numTrimmedByZeros === numStr) return num;
                    else if(sign+numTrimmedByZeros === numStr) return num;
                    else return str;
                }

                if(trimmedStr === numStr) return num;
                else if(trimmedStr === sign+numStr) return num;
                // else{
                //     //number with +/- sign
                //     trimmedStr.test(/[-+][0-9]);

                // }
                return str;
            }
            // else if(!eNotation && trimmedStr && trimmedStr !== Number(trimmedStr) ) return str;
            
        }else{ //non-numeric string
            return str;
        }
    }
}

/**
 * 
 * @param {string} numStr without leading zeros
 * @returns 
 */
function trimZeros(numStr){
    if(numStr && numStr.indexOf(".") !== -1){//float
        numStr = numStr.replace(/0+$/, ""); //remove ending zeros
        if(numStr === ".")  numStr = "0";
        else if(numStr[0] === ".")  numStr = "0"+numStr;
        else if(numStr[numStr.length-1] === ".")  numStr = numStr.substr(0,numStr.length-1);
        return numStr;
    }
    return numStr;
}
module.exports = toNumber


/***/ }),

/***/ 4920:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var parser = __nccwpck_require__(5642);
var compiler = __nccwpck_require__(8215);

module.exports = {
  parse: function(input) {
    var nodes = parser.parse(input.toString());
    return compiler.compile(nodes);
  }
};


/***/ }),

/***/ 8215:
/***/ ((module) => {

"use strict";

function compile(nodes) {
  var assignedPaths = [];
  var valueAssignments = [];
  var currentPath = "";
  var data = Object.create(null);
  var context = data;
  var arrayMode = false;

  return reduce(nodes);

  function reduce(nodes) {
    var node;
    for (var i = 0; i < nodes.length; i++) {
      node = nodes[i];
      switch (node.type) {
      case "Assign":
        assign(node);
        break;
      case "ObjectPath":
        setPath(node);
        break;
      case "ArrayPath":
        addTableArray(node);
        break;
      }
    }

    return data;
  }

  function genError(err, line, col) {
    var ex = new Error(err);
    ex.line = line;
    ex.column = col;
    throw ex;
  }

  function assign(node) {
    var key = node.key;
    var value = node.value;
    var line = node.line;
    var column = node.column;

    var fullPath;
    if (currentPath) {
      fullPath = currentPath + "." + key;
    } else {
      fullPath = key;
    }
    if (typeof context[key] !== "undefined") {
      genError("Cannot redefine existing key '" + fullPath + "'.", line, column);
    }

    context[key] = reduceValueNode(value);

    if (!pathAssigned(fullPath)) {
      assignedPaths.push(fullPath);
      valueAssignments.push(fullPath);
    }
  }


  function pathAssigned(path) {
    return assignedPaths.indexOf(path) !== -1;
  }

  function reduceValueNode(node) {
    if (node.type === "Array") {
      return reduceArrayWithTypeChecking(node.value);
    } else if (node.type === "InlineTable") {
      return reduceInlineTableNode(node.value);
    } else {
      return node.value;
    }
  }

  function reduceInlineTableNode(values) {
    var obj = Object.create(null);
    for (var i = 0; i < values.length; i++) {
      var val = values[i];
      if (val.value.type === "InlineTable") {
        obj[val.key] = reduceInlineTableNode(val.value.value);
      } else if (val.type === "InlineTableValue") {
        obj[val.key] = reduceValueNode(val.value);
      }
    }

    return obj;
  }

  function setPath(node) {
    var path = node.value;
    var quotedPath = path.map(quoteDottedString).join(".");
    var line = node.line;
    var column = node.column;

    if (pathAssigned(quotedPath)) {
      genError("Cannot redefine existing key '" + path + "'.", line, column);
    }
    assignedPaths.push(quotedPath);
    context = deepRef(data, path, Object.create(null), line, column);
    currentPath = path;
  }

  function addTableArray(node) {
    var path = node.value;
    var quotedPath = path.map(quoteDottedString).join(".");
    var line = node.line;
    var column = node.column;

    if (!pathAssigned(quotedPath)) {
      assignedPaths.push(quotedPath);
    }
    assignedPaths = assignedPaths.filter(function(p) {
      return p.indexOf(quotedPath) !== 0;
    });
    assignedPaths.push(quotedPath);
    context = deepRef(data, path, [], line, column);
    currentPath = quotedPath;

    if (context instanceof Array) {
      var newObj = Object.create(null);
      context.push(newObj);
      context = newObj;
    } else {
      genError("Cannot redefine existing key '" + path + "'.", line, column);
    }
  }

  // Given a path 'a.b.c', create (as necessary) `start.a`,
  // `start.a.b`, and `start.a.b.c`, assigning `value` to `start.a.b.c`.
  // If `a` or `b` are arrays and have items in them, the last item in the
  // array is used as the context for the next sub-path.
  function deepRef(start, keys, value, line, column) {
    var traversed = [];
    var traversedPath = "";
    var path = keys.join(".");
    var ctx = start;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      traversed.push(key);
      traversedPath = traversed.join(".");
      if (typeof ctx[key] === "undefined") {
        if (i === keys.length - 1) {
          ctx[key] = value;
        } else {
          ctx[key] = Object.create(null);
        }
      } else if (i !== keys.length - 1 && valueAssignments.indexOf(traversedPath) > -1) {
        // already a non-object value at key, can't be used as part of a new path
        genError("Cannot redefine existing key '" + traversedPath + "'.", line, column);
      }

      ctx = ctx[key];
      if (ctx instanceof Array && ctx.length && i < keys.length - 1) {
        ctx = ctx[ctx.length - 1];
      }
    }

    return ctx;
  }

  function reduceArrayWithTypeChecking(array) {
    // Ensure that all items in the array are of the same type
    var firstType = null;
    for (var i = 0; i < array.length; i++) {
      var node = array[i];
      if (firstType === null) {
        firstType = node.type;
      } else {
        if (node.type !== firstType) {
          genError("Cannot add value of type " + node.type + " to array of type " +
            firstType + ".", node.line, node.column);
        }
      }
    }

    // Recursively reduce array of nodes into array of the nodes' values
    return array.map(reduceValueNode);
  }

  function quoteDottedString(str) {
    if (str.indexOf(".") > -1) {
      return "\"" + str + "\"";
    } else {
      return str;
    }
  }
}

module.exports = {
  compile: compile
};


/***/ }),

/***/ 5642:
/***/ ((module) => {

module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = [],
        peg$c1 = function() { return nodes },
        peg$c2 = peg$FAILED,
        peg$c3 = "#",
        peg$c4 = { type: "literal", value: "#", description: "\"#\"" },
        peg$c5 = void 0,
        peg$c6 = { type: "any", description: "any character" },
        peg$c7 = "[",
        peg$c8 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c9 = "]",
        peg$c10 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c11 = function(name) { addNode(node('ObjectPath', name, line, column)) },
        peg$c12 = function(name) { addNode(node('ArrayPath', name, line, column)) },
        peg$c13 = function(parts, name) { return parts.concat(name) },
        peg$c14 = function(name) { return [name] },
        peg$c15 = function(name) { return name },
        peg$c16 = ".",
        peg$c17 = { type: "literal", value: ".", description: "\".\"" },
        peg$c18 = "=",
        peg$c19 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c20 = function(key, value) { addNode(node('Assign', value, line, column, key)) },
        peg$c21 = function(chars) { return chars.join('') },
        peg$c22 = function(node) { return node.value },
        peg$c23 = "\"\"\"",
        peg$c24 = { type: "literal", value: "\"\"\"", description: "\"\\\"\\\"\\\"\"" },
        peg$c25 = null,
        peg$c26 = function(chars) { return node('String', chars.join(''), line, column) },
        peg$c27 = "\"",
        peg$c28 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c29 = "'''",
        peg$c30 = { type: "literal", value: "'''", description: "\"'''\"" },
        peg$c31 = "'",
        peg$c32 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c33 = function(char) { return char },
        peg$c34 = function(char) { return char},
        peg$c35 = "\\",
        peg$c36 = { type: "literal", value: "\\", description: "\"\\\\\"" },
        peg$c37 = function() { return '' },
        peg$c38 = "e",
        peg$c39 = { type: "literal", value: "e", description: "\"e\"" },
        peg$c40 = "E",
        peg$c41 = { type: "literal", value: "E", description: "\"E\"" },
        peg$c42 = function(left, right) { return node('Float', parseFloat(left + 'e' + right), line, column) },
        peg$c43 = function(text) { return node('Float', parseFloat(text), line, column) },
        peg$c44 = "+",
        peg$c45 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c46 = function(digits) { return digits.join('') },
        peg$c47 = "-",
        peg$c48 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c49 = function(digits) { return '-' + digits.join('') },
        peg$c50 = function(text) { return node('Integer', parseInt(text, 10), line, column) },
        peg$c51 = "true",
        peg$c52 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c53 = function() { return node('Boolean', true, line, column) },
        peg$c54 = "false",
        peg$c55 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c56 = function() { return node('Boolean', false, line, column) },
        peg$c57 = function() { return node('Array', [], line, column) },
        peg$c58 = function(value) { return node('Array', value ? [value] : [], line, column) },
        peg$c59 = function(values) { return node('Array', values, line, column) },
        peg$c60 = function(values, value) { return node('Array', values.concat(value), line, column) },
        peg$c61 = function(value) { return value },
        peg$c62 = ",",
        peg$c63 = { type: "literal", value: ",", description: "\",\"" },
        peg$c64 = "{",
        peg$c65 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c66 = "}",
        peg$c67 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c68 = function(values) { return node('InlineTable', values, line, column) },
        peg$c69 = function(key, value) { return node('InlineTableValue', value, line, column, key) },
        peg$c70 = function(digits) { return "." + digits },
        peg$c71 = function(date) { return  date.join('') },
        peg$c72 = ":",
        peg$c73 = { type: "literal", value: ":", description: "\":\"" },
        peg$c74 = function(time) { return time.join('') },
        peg$c75 = "T",
        peg$c76 = { type: "literal", value: "T", description: "\"T\"" },
        peg$c77 = "Z",
        peg$c78 = { type: "literal", value: "Z", description: "\"Z\"" },
        peg$c79 = function(date, time) { return node('Date', new Date(date + "T" + time + "Z"), line, column) },
        peg$c80 = function(date, time) { return node('Date', new Date(date + "T" + time), line, column) },
        peg$c81 = /^[ \t]/,
        peg$c82 = { type: "class", value: "[ \\t]", description: "[ \\t]" },
        peg$c83 = "\n",
        peg$c84 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c85 = "\r",
        peg$c86 = { type: "literal", value: "\r", description: "\"\\r\"" },
        peg$c87 = /^[0-9a-f]/i,
        peg$c88 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
        peg$c89 = /^[0-9]/,
        peg$c90 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c91 = "_",
        peg$c92 = { type: "literal", value: "_", description: "\"_\"" },
        peg$c93 = function() { return "" },
        peg$c94 = /^[A-Za-z0-9_\-]/,
        peg$c95 = { type: "class", value: "[A-Za-z0-9_\\-]", description: "[A-Za-z0-9_\\-]" },
        peg$c96 = function(d) { return d.join('') },
        peg$c97 = "\\\"",
        peg$c98 = { type: "literal", value: "\\\"", description: "\"\\\\\\\"\"" },
        peg$c99 = function() { return '"'  },
        peg$c100 = "\\\\",
        peg$c101 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c102 = function() { return '\\' },
        peg$c103 = "\\b",
        peg$c104 = { type: "literal", value: "\\b", description: "\"\\\\b\"" },
        peg$c105 = function() { return '\b' },
        peg$c106 = "\\t",
        peg$c107 = { type: "literal", value: "\\t", description: "\"\\\\t\"" },
        peg$c108 = function() { return '\t' },
        peg$c109 = "\\n",
        peg$c110 = { type: "literal", value: "\\n", description: "\"\\\\n\"" },
        peg$c111 = function() { return '\n' },
        peg$c112 = "\\f",
        peg$c113 = { type: "literal", value: "\\f", description: "\"\\\\f\"" },
        peg$c114 = function() { return '\f' },
        peg$c115 = "\\r",
        peg$c116 = { type: "literal", value: "\\r", description: "\"\\\\r\"" },
        peg$c117 = function() { return '\r' },
        peg$c118 = "\\U",
        peg$c119 = { type: "literal", value: "\\U", description: "\"\\\\U\"" },
        peg$c120 = function(digits) { return convertCodePoint(digits.join('')) },
        peg$c121 = "\\u",
        peg$c122 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$cache = {},
        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 0,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseline();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseline();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c1();
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseline() {
      var s0, s1, s2, s3, s4, s5, s6;

      var key    = peg$currPos * 49 + 1,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseS();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseS();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseexpression();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parsecomment();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsecomment();
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseNL();
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseNL();
                }
              } else {
                s5 = peg$c2;
              }
              if (s5 === peg$FAILED) {
                s5 = peg$parseEOF();
              }
              if (s5 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4, s5];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseS();
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parseS();
          }
        } else {
          s1 = peg$c2;
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseNL();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseNL();
            }
          } else {
            s2 = peg$c2;
          }
          if (s2 === peg$FAILED) {
            s2 = peg$parseEOF();
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseNL();
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseexpression() {
      var s0;

      var key    = peg$currPos * 49 + 2,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parsecomment();
      if (s0 === peg$FAILED) {
        s0 = peg$parsepath();
        if (s0 === peg$FAILED) {
          s0 = peg$parsetablearray();
          if (s0 === peg$FAILED) {
            s0 = peg$parseassignment();
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsecomment() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 3,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 35) {
        s1 = peg$c3;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        s5 = peg$parseNL();
        if (s5 === peg$FAILED) {
          s5 = peg$parseEOF();
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c5;
        } else {
          peg$currPos = s4;
          s4 = peg$c2;
        }
        if (s4 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c6); }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c2;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          s5 = peg$parseNL();
          if (s5 === peg$FAILED) {
            s5 = peg$parseEOF();
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c5;
          } else {
            peg$currPos = s4;
            s4 = peg$c2;
          }
          if (s4 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c2;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsepath() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 4,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseS();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseS();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsetable_key();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseS();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseS();
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s5 = peg$c9;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c11(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetablearray() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      var key    = peg$currPos * 49 + 5,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 91) {
          s2 = peg$c7;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsetable_key();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseS();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parseS();
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s6 = peg$c9;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c10); }
                }
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c12(s4);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetable_key() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 6,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsedot_ended_table_key_part();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsedot_ended_table_key_part();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsetable_key_part();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c13(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsetable_key_part();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c14(s1);
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetable_key_part() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 7,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseS();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseS();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsekey();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c15(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseS();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseS();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsequoted_key();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseS();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseS();
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c15(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedot_ended_table_key_part() {
      var s0, s1, s2, s3, s4, s5, s6;

      var key    = peg$currPos * 49 + 8,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseS();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseS();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsekey();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s4 = peg$c16;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseS();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parseS();
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c15(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseS();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseS();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsequoted_key();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseS();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseS();
            }
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 46) {
                s4 = peg$c16;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c17); }
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseS();
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseS();
                }
                if (s5 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c15(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseassignment() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 9,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsekey();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseS();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseS();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s3 = peg$c18;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c19); }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseS();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseS();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsevalue();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c20(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsequoted_key();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseS();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseS();
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s3 = peg$c18;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c19); }
            }
            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parseS();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parseS();
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsevalue();
                if (s5 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c20(s1, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsekey() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 10,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseASCII_BASIC();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseASCII_BASIC();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c21(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsequoted_key() {
      var s0, s1;

      var key    = peg$currPos * 49 + 11,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsedouble_quoted_single_line_string();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c22(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsesingle_quoted_single_line_string();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c22(s1);
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsevalue() {
      var s0;

      var key    = peg$currPos * 49 + 12,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parsestring();
      if (s0 === peg$FAILED) {
        s0 = peg$parsedatetime();
        if (s0 === peg$FAILED) {
          s0 = peg$parsefloat();
          if (s0 === peg$FAILED) {
            s0 = peg$parseinteger();
            if (s0 === peg$FAILED) {
              s0 = peg$parseboolean();
              if (s0 === peg$FAILED) {
                s0 = peg$parsearray();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseinline_table();
                }
              }
            }
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsestring() {
      var s0;

      var key    = peg$currPos * 49 + 13,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parsedouble_quoted_multiline_string();
      if (s0 === peg$FAILED) {
        s0 = peg$parsedouble_quoted_single_line_string();
        if (s0 === peg$FAILED) {
          s0 = peg$parsesingle_quoted_multiline_string();
          if (s0 === peg$FAILED) {
            s0 = peg$parsesingle_quoted_single_line_string();
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedouble_quoted_multiline_string() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 14,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c23) {
        s1 = peg$c23;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c24); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseNL();
        if (s2 === peg$FAILED) {
          s2 = peg$c25;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsemultiline_string_char();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsemultiline_string_char();
          }
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c23) {
              s4 = peg$c23;
              peg$currPos += 3;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c24); }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c26(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedouble_quoted_single_line_string() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 49 + 15,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c27;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsestring_char();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsestring_char();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c27;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c28); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c26(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsesingle_quoted_multiline_string() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 16,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c29) {
        s1 = peg$c29;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseNL();
        if (s2 === peg$FAILED) {
          s2 = peg$c25;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsemultiline_literal_char();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsemultiline_literal_char();
          }
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c29) {
              s4 = peg$c29;
              peg$currPos += 3;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c30); }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c26(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsesingle_quoted_single_line_string() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 49 + 17,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c31;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseliteral_char();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseliteral_char();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s3 = peg$c31;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c26(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsestring_char() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 18,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parseESCAPED();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c27;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c28); }
        }
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = peg$c5;
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c6); }
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c33(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseliteral_char() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 19,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 39) {
        s2 = peg$c31;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = peg$c5;
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c33(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsemultiline_string_char() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 20,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parseESCAPED();
      if (s0 === peg$FAILED) {
        s0 = peg$parsemultiline_string_delim();
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 3) === peg$c23) {
            s2 = peg$c23;
            peg$currPos += 3;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c24); }
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = peg$c5;
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
          if (s1 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c34(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsemultiline_string_delim() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 21,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 92) {
        s1 = peg$c35;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseNL();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseNLS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseNLS();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c37();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsemultiline_literal_char() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 22,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 3) === peg$c29) {
        s2 = peg$c29;
        peg$currPos += 3;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = peg$c5;
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c33(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsefloat() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 49 + 23,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsefloat_text();
      if (s1 === peg$FAILED) {
        s1 = peg$parseinteger_text();
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 101) {
          s2 = peg$c38;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c39); }
        }
        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 69) {
            s2 = peg$c40;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c41); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseinteger_text();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c42(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsefloat_text();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c43(s1);
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsefloat_text() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 24,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c44;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c25;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseDIGITS();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s4 = peg$c16;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseDIGITS();
            if (s5 !== peg$FAILED) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c46(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c47;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c48); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parseDIGITS();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s4 = peg$c16;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseDIGITS();
              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c49(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseinteger() {
      var s0, s1;

      var key    = peg$currPos * 49 + 25,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseinteger_text();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c50(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseinteger_text() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 26,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c44;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c25;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseDIGIT_OR_UNDER();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseDIGIT_OR_UNDER();
          }
        } else {
          s2 = peg$c2;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 46) {
            s4 = peg$c16;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = peg$c5;
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c46(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c47;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c48); }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseDIGIT_OR_UNDER();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseDIGIT_OR_UNDER();
            }
          } else {
            s2 = peg$c2;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 46) {
              s4 = peg$c16;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = peg$c5;
            } else {
              peg$currPos = s3;
              s3 = peg$c2;
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c49(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseboolean() {
      var s0, s1;

      var key    = peg$currPos * 49 + 27,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c51) {
        s1 = peg$c51;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c53();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c54) {
          s1 = peg$c54;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c55); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c56();
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 28,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsearray_sep();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsearray_sep();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 93) {
            s3 = peg$c9;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c57();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 91) {
          s1 = peg$c7;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsearray_value();
          if (s2 === peg$FAILED) {
            s2 = peg$c25;
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s3 = peg$c9;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c10); }
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c58(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c7;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsearray_value_list();
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsearray_value_list();
              }
            } else {
              s2 = peg$c2;
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s3 = peg$c9;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c59(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
              s1 = peg$c7;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c8); }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsearray_value_list();
              if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  s3 = peg$parsearray_value_list();
                }
              } else {
                s2 = peg$c2;
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parsearray_value();
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s4 = peg$c9;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s4 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c60(s2, s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray_value() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 29,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsearray_sep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsearray_sep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsevalue();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsearray_sep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsearray_sep();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c61(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray_value_list() {
      var s0, s1, s2, s3, s4, s5, s6;

      var key    = peg$currPos * 49 + 30,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsearray_sep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsearray_sep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsevalue();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsearray_sep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsearray_sep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c62;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c63); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsearray_sep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsearray_sep();
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c61(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray_sep() {
      var s0;

      var key    = peg$currPos * 49 + 31,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parseS();
      if (s0 === peg$FAILED) {
        s0 = peg$parseNL();
        if (s0 === peg$FAILED) {
          s0 = peg$parsecomment();
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseinline_table() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 32,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c64;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c65); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseS();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseS();
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseinline_table_assignment();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseinline_table_assignment();
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseS();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseS();
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 125) {
                s5 = peg$c66;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c67); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c68(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseinline_table_assignment() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      var key    = peg$currPos * 49 + 33,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseS();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseS();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsekey();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s4 = peg$c18;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c19); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseS();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parseS();
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsevalue();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$parseS();
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parseS();
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s8 = peg$c62;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c63); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = [];
                      s10 = peg$parseS();
                      while (s10 !== peg$FAILED) {
                        s9.push(s10);
                        s10 = peg$parseS();
                      }
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c69(s2, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseS();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseS();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsekey();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseS();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseS();
            }
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s4 = peg$c18;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c19); }
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseS();
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseS();
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsevalue();
                  if (s6 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c69(s2, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsesecfragment() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 34,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s1 = peg$c16;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDIGITS();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c70(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedate() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

      var key    = peg$currPos * 49 + 35,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseDIGIT_OR_UNDER();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseDIGIT_OR_UNDER();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseDIGIT_OR_UNDER();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseDIGIT_OR_UNDER();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 45) {
                s6 = peg$c47;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c48); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseDIGIT_OR_UNDER();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseDIGIT_OR_UNDER();
                  if (s8 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 45) {
                      s9 = peg$c47;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c48); }
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parseDIGIT_OR_UNDER();
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parseDIGIT_OR_UNDER();
                        if (s11 !== peg$FAILED) {
                          s2 = [s2, s3, s4, s5, s6, s7, s8, s9, s10, s11];
                          s1 = s2;
                        } else {
                          peg$currPos = s1;
                          s1 = peg$c2;
                        }
                      } else {
                        peg$currPos = s1;
                        s1 = peg$c2;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$c2;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$c2;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c71(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetime() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      var key    = peg$currPos * 49 + 36,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseDIGIT_OR_UNDER();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseDIGIT_OR_UNDER();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s4 = peg$c72;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c73); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseDIGIT_OR_UNDER();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseDIGIT_OR_UNDER();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                  s7 = peg$c72;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c73); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseDIGIT_OR_UNDER();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseDIGIT_OR_UNDER();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsesecfragment();
                      if (s10 === peg$FAILED) {
                        s10 = peg$c25;
                      }
                      if (s10 !== peg$FAILED) {
                        s2 = [s2, s3, s4, s5, s6, s7, s8, s9, s10];
                        s1 = s2;
                      } else {
                        peg$currPos = s1;
                        s1 = peg$c2;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$c2;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$c2;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c74(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetime_with_offset() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16;

      var key    = peg$currPos * 49 + 37,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseDIGIT_OR_UNDER();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseDIGIT_OR_UNDER();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s4 = peg$c72;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c73); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseDIGIT_OR_UNDER();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseDIGIT_OR_UNDER();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                  s7 = peg$c72;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c73); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseDIGIT_OR_UNDER();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseDIGIT_OR_UNDER();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsesecfragment();
                      if (s10 === peg$FAILED) {
                        s10 = peg$c25;
                      }
                      if (s10 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 45) {
                          s11 = peg$c47;
                          peg$currPos++;
                        } else {
                          s11 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c48); }
                        }
                        if (s11 === peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 43) {
                            s11 = peg$c44;
                            peg$currPos++;
                          } else {
                            s11 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c45); }
                          }
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parseDIGIT_OR_UNDER();
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parseDIGIT_OR_UNDER();
                            if (s13 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 58) {
                                s14 = peg$c72;
                                peg$currPos++;
                              } else {
                                s14 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c73); }
                              }
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parseDIGIT_OR_UNDER();
                                if (s15 !== peg$FAILED) {
                                  s16 = peg$parseDIGIT_OR_UNDER();
                                  if (s16 !== peg$FAILED) {
                                    s2 = [s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16];
                                    s1 = s2;
                                  } else {
                                    peg$currPos = s1;
                                    s1 = peg$c2;
                                  }
                                } else {
                                  peg$currPos = s1;
                                  s1 = peg$c2;
                                }
                              } else {
                                peg$currPos = s1;
                                s1 = peg$c2;
                              }
                            } else {
                              peg$currPos = s1;
                              s1 = peg$c2;
                            }
                          } else {
                            peg$currPos = s1;
                            s1 = peg$c2;
                          }
                        } else {
                          peg$currPos = s1;
                          s1 = peg$c2;
                        }
                      } else {
                        peg$currPos = s1;
                        s1 = peg$c2;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$c2;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$c2;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c74(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedatetime() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 38,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsedate();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 84) {
          s2 = peg$c75;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c76); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsetime();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 90) {
              s4 = peg$c77;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c78); }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c79(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsedate();
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 84) {
            s2 = peg$c75;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c76); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsetime_with_offset();
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c80(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseS() {
      var s0;

      var key    = peg$currPos * 49 + 39,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (peg$c81.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c82); }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseNL() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 40,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c83;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c84); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c85;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c86); }
        }
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 10) {
            s2 = peg$c83;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c84); }
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseNLS() {
      var s0;

      var key    = peg$currPos * 49 + 41,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parseNL();
      if (s0 === peg$FAILED) {
        s0 = peg$parseS();
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseEOF() {
      var s0, s1;

      var key    = peg$currPos * 49 + 42,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      peg$silentFails++;
      if (input.length > peg$currPos) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }
      peg$silentFails--;
      if (s1 === peg$FAILED) {
        s0 = peg$c5;
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseHEX() {
      var s0;

      var key    = peg$currPos * 49 + 43,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (peg$c87.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c88); }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseDIGIT_OR_UNDER() {
      var s0, s1;

      var key    = peg$currPos * 49 + 44,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (peg$c89.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 95) {
          s1 = peg$c91;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c92); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c93();
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseASCII_BASIC() {
      var s0;

      var key    = peg$currPos * 49 + 45,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (peg$c94.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c95); }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseDIGITS() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 46,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseDIGIT_OR_UNDER();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseDIGIT_OR_UNDER();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c96(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseESCAPED() {
      var s0, s1;

      var key    = peg$currPos * 49 + 47,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c97) {
        s1 = peg$c97;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c98); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c99();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c100) {
          s1 = peg$c100;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c101); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c102();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c103) {
            s1 = peg$c103;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c104); }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c105();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c106) {
              s1 = peg$c106;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c107); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c108();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c109) {
                s1 = peg$c109;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c110); }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c111();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c112) {
                  s1 = peg$c112;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c113); }
                }
                if (s1 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c114();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 2) === peg$c115) {
                    s1 = peg$c115;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c116); }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c117();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseESCAPED_UNICODE();
                  }
                }
              }
            }
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseESCAPED_UNICODE() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      var key    = peg$currPos * 49 + 48,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c118) {
        s1 = peg$c118;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c119); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseHEX();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseHEX();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseHEX();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseHEX();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseHEX();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseHEX();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseHEX();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parseHEX();
                      if (s10 !== peg$FAILED) {
                        s3 = [s3, s4, s5, s6, s7, s8, s9, s10];
                        s2 = s3;
                      } else {
                        peg$currPos = s2;
                        s2 = peg$c2;
                      }
                    } else {
                      peg$currPos = s2;
                      s2 = peg$c2;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c2;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c120(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c121) {
          s1 = peg$c121;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c122); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parseHEX();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseHEX();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseHEX();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseHEX();
                if (s6 !== peg$FAILED) {
                  s3 = [s3, s4, s5, s6];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c120(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }


      var nodes = [];

      function genError(err, line, col) {
        var ex = new Error(err);
        ex.line = line;
        ex.column = col;
        throw ex;
      }

      function addNode(node) {
        nodes.push(node);
      }

      function node(type, value, line, column, key) {
        var obj = { type: type, value: value, line: line(), column: column() };
        if (key) obj.key = key;
        return obj;
      }

      function convertCodePoint(str, line, col) {
        var num = parseInt("0x" + str);

        if (
          !isFinite(num) ||
          Math.floor(num) != num ||
          num < 0 ||
          num > 0x10FFFF ||
          (num > 0xD7FF && num < 0xE000)
        ) {
          genError("Invalid Unicode escape code: " + str, line, col);
        } else {
          return fromCodePoint(num);
        }
      }

      function fromCodePoint() {
        var MAX_SIZE = 0x4000;
        var codeUnits = [];
        var highSurrogate;
        var lowSurrogate;
        var index = -1;
        var length = arguments.length;
        if (!length) {
          return '';
        }
        var result = '';
        while (++index < length) {
          var codePoint = Number(arguments[index]);
          if (codePoint <= 0xFFFF) { // BMP code point
            codeUnits.push(codePoint);
          } else { // Astral code point; split in surrogate halves
            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000;
            highSurrogate = (codePoint >> 10) + 0xD800;
            lowSurrogate = (codePoint % 0x400) + 0xDC00;
            codeUnits.push(highSurrogate, lowSurrogate);
          }
          if (index + 1 == length || codeUnits.length > MAX_SIZE) {
            result += String.fromCharCode.apply(null, codeUnits);
            codeUnits.length = 0;
          }
        }
        return result;
      }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 399:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const core = __importStar(__nccwpck_require__(2186));
const version_1 = __nccwpck_require__(1946);
async function run() {
    const ref = core.getInput('ref');
    const workspace = core.getInput('workspace');
    const versionInput = core.getInput('version');
    if ((workspace === '' && versionInput === '') ||
        (workspace !== '' && versionInput !== '')) {
        core.setFailed('Either workspace or version must be defined');
        return;
    }
    core.info(`Ref: ${ref}`);
    core.info(`Workspace: ${workspace}`);
    core.info(`Input Version: ${versionInput}`);
    // Get version from input, or infer it from the workspace
    const version = versionInput
        ? new version_1.Version(versionInput)
        : version_1.Version.infer(workspace);
    if (version === undefined) {
        core.setFailed('Could not infer version');
        return;
    }
    core.info(`Inferred Version: ${version.toString()}`);
    // TODO: Set the verison tags
    core.setOutput('version', version.toString(false));
    core.setOutput('major-minor-patch', `${version.major}.${version.minor}.${version.patch}`);
    core.setOutput('major-minor', `${version.major}.${version.minor}`);
    core.setOutput('major', version.major);
    core.setOutput('minor', version.minor);
    core.setOutput('patch', version.patch);
    core.setOutput('prerelease', version.prerelease);
}
exports.run = run;


/***/ }),

/***/ 1946:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Version = void 0;
const core = __importStar(__nccwpck_require__(2186));
const fs_1 = __importDefault(__nccwpck_require__(7147));
const toml = __importStar(__nccwpck_require__(4920));
const fast_xml_parser_1 = __nccwpck_require__(2603);
/**
 * A parsed, SemVer-compliant version
 */
class Version {
    major;
    minor;
    patch;
    prerelease;
    /**
     * Create a new Version instance from a version string
     *
     * @param version A SemVer-compliant version string
     */
    constructor(version) {
        core.info(`Parsing version: ${version}`);
        // (https://semver.org/#spec-item-10) Build metadata can be discarded
        version = version.split('+')[0];
        // (https://semver.org/#spec-item-9) Prerelease is separated by a `-`
        if (version.includes('-')) {
            this.prerelease = version.split('-')[1];
            version = version.split('-')[0];
        }
        const splitVersion = version.split('.');
        // Some frameworks just don't add minor/patch versions
        this.major = splitVersion[0];
        this.minor = splitVersion[1] ?? '0';
        this.patch = splitVersion[2] ?? '0';
        // Check if prerelease was separated with a '.' instead of a '-'
        if (this.prerelease === undefined && version.split('.').length > 3)
            this.prerelease = splitVersion.slice(3).join('.');
        if (this.major === undefined || this.major === '')
            throw new Error(`Invalid version string!`);
        core.info(`Parsed version: ${this.toString()}`);
    }
    /**
     * Print the version as a string
     *
     * @param prefix True to include the 'v' prefix (e.g. 'v1.2.3')
     * @returns The version as a string
     */
    toString(prefix = true) {
        return `${prefix ? 'v' : ''}${this.major}.${this.minor}.${this.patch}${this.prerelease ? `-${this.prerelease}` : ''}`;
    }
    /**
     * Infer the version from the project workspace
     *
     * @param workspace The project workspace
     * @returns The version as a Version instance
     */
    static infer(workspace) {
        // Supported manifest files
        // Node.js: package.json
        // Python: pyproject.toml, setup.cfg, setup.py
        // Java: pom.xml
        const manifests = [
            'package.json',
            'pyproject.toml',
            'setup.cfg',
            'setup.py',
            'pom.xml'
        ];
        for (const manifest of manifests) {
            try {
                // Try to read the manifest file
                const body = fs_1.default.readFileSync(`${workspace}/${manifest}`, 'utf8');
                switch (manifest) {
                    case 'package.json': {
                        const jsonBody = JSON.parse(body);
                        if (jsonBody.version !== undefined)
                            return new Version(jsonBody.version);
                        break;
                    }
                    case 'pyproject.toml': {
                        const tomlBody = toml.parse(body);
                        const version = tomlBody.project?.version || tomlBody.tool?.poetry?.version;
                        if (version !== undefined)
                            return new Version(version);
                        break;
                    }
                    case 'setup.cfg': {
                        const regex = /version\s?=\s?['"]?(?<version>[^'"\n]+)/;
                        const version = body.match(regex)?.groups?.version;
                        if (version !== undefined)
                            return new Version(version);
                        break;
                    }
                    case 'setup.py': {
                        const regex = /version\s?=\s?['"](?<version>[^'"\r\n]+)['"],?/;
                        const version = body.match(regex)?.groups?.version;
                        if (version !== undefined)
                            return new Version(version);
                        break;
                    }
                    case 'pom.xml': {
                        const parser = new fast_xml_parser_1.XMLParser();
                        const xml = parser.parse(body);
                        const version = xml.project?.version;
                        if (version !== undefined)
                            return new Version(version.toString());
                        break;
                    }
                }
            }
            catch (error) {
                // Ignore file not found errors
                if (error.code !== 'ENOENT')
                    throw error;
            }
        }
        return undefined;
    }
}
exports.Version = Version;


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The entrypoint for the action.
 */
const main_1 = __nccwpck_require__(399);
(0, main_1.run)();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map