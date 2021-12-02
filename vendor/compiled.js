/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.cls = (function() {

    /**
     * Namespace cls.
     * @exports cls
     * @namespace
     */
    var cls = {};

    cls.Log = (function() {

        /**
         * Properties of a Log.
         * @memberof cls
         * @interface ILog
         * @property {number|Long|null} [time] Log time
         * @property {Array.<cls.Log.IContent>|null} [contents] Log contents
         */

        /**
         * Constructs a new Log.
         * @memberof cls
         * @classdesc Represents a Log.
         * @implements ILog
         * @constructor
         * @param {cls.ILog=} [properties] Properties to set
         */
        function Log(properties) {
            this.contents = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Log time.
         * @member {number|Long} time
         * @memberof cls.Log
         * @instance
         */
        Log.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Log contents.
         * @member {Array.<cls.Log.IContent>} contents
         * @memberof cls.Log
         * @instance
         */
        Log.prototype.contents = $util.emptyArray;

        /**
         * Creates a new Log instance using the specified properties.
         * @function create
         * @memberof cls.Log
         * @static
         * @param {cls.ILog=} [properties] Properties to set
         * @returns {cls.Log} Log instance
         */
        Log.create = function create(properties) {
            return new Log(properties);
        };

        /**
         * Encodes the specified Log message. Does not implicitly {@link cls.Log.verify|verify} messages.
         * @function encode
         * @memberof cls.Log
         * @static
         * @param {cls.ILog} message Log message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Log.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.time);
            if (message.contents != null && message.contents.length)
                for (var i = 0; i < message.contents.length; ++i)
                    $root.cls.Log.Content.encode(message.contents[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Log message, length delimited. Does not implicitly {@link cls.Log.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cls.Log
         * @static
         * @param {cls.ILog} message Log message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Log.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Log message from the specified reader or buffer.
         * @function decode
         * @memberof cls.Log
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cls.Log} Log
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Log.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cls.Log();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.time = reader.int64();
                    break;
                case 2:
                    if (!(message.contents && message.contents.length))
                        message.contents = [];
                    message.contents.push($root.cls.Log.Content.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Log message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cls.Log
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cls.Log} Log
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Log.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Log message.
         * @function verify
         * @memberof cls.Log
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Log.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                    return "time: integer|Long expected";
            if (message.contents != null && message.hasOwnProperty("contents")) {
                if (!Array.isArray(message.contents))
                    return "contents: array expected";
                for (var i = 0; i < message.contents.length; ++i) {
                    var error = $root.cls.Log.Content.verify(message.contents[i]);
                    if (error)
                        return "contents." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Log message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cls.Log
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cls.Log} Log
         */
        Log.fromObject = function fromObject(object) {
            if (object instanceof $root.cls.Log)
                return object;
            var message = new $root.cls.Log();
            if (object.time != null)
                if ($util.Long)
                    (message.time = $util.Long.fromValue(object.time)).unsigned = false;
                else if (typeof object.time === "string")
                    message.time = parseInt(object.time, 10);
                else if (typeof object.time === "number")
                    message.time = object.time;
                else if (typeof object.time === "object")
                    message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber();
            if (object.contents) {
                if (!Array.isArray(object.contents))
                    throw TypeError(".cls.Log.contents: array expected");
                message.contents = [];
                for (var i = 0; i < object.contents.length; ++i) {
                    if (typeof object.contents[i] !== "object")
                        throw TypeError(".cls.Log.contents: object expected");
                    message.contents[i] = $root.cls.Log.Content.fromObject(object.contents[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Log message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cls.Log
         * @static
         * @param {cls.Log} message Log
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Log.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.contents = [];
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.time = options.longs === String ? "0" : 0;
            if (message.time != null && message.hasOwnProperty("time"))
                if (typeof message.time === "number")
                    object.time = options.longs === String ? String(message.time) : message.time;
                else
                    object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
            if (message.contents && message.contents.length) {
                object.contents = [];
                for (var j = 0; j < message.contents.length; ++j)
                    object.contents[j] = $root.cls.Log.Content.toObject(message.contents[j], options);
            }
            return object;
        };

        /**
         * Converts this Log to JSON.
         * @function toJSON
         * @memberof cls.Log
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Log.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        Log.Content = (function() {

            /**
             * Properties of a Content.
             * @memberof cls.Log
             * @interface IContent
             * @property {string|null} [key] Content key
             * @property {string|null} [value] Content value
             */

            /**
             * Constructs a new Content.
             * @memberof cls.Log
             * @classdesc Represents a Content.
             * @implements IContent
             * @constructor
             * @param {cls.Log.IContent=} [properties] Properties to set
             */
            function Content(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Content key.
             * @member {string} key
             * @memberof cls.Log.Content
             * @instance
             */
            Content.prototype.key = "";

            /**
             * Content value.
             * @member {string} value
             * @memberof cls.Log.Content
             * @instance
             */
            Content.prototype.value = "";

            /**
             * Creates a new Content instance using the specified properties.
             * @function create
             * @memberof cls.Log.Content
             * @static
             * @param {cls.Log.IContent=} [properties] Properties to set
             * @returns {cls.Log.Content} Content instance
             */
            Content.create = function create(properties) {
                return new Content(properties);
            };

            /**
             * Encodes the specified Content message. Does not implicitly {@link cls.Log.Content.verify|verify} messages.
             * @function encode
             * @memberof cls.Log.Content
             * @static
             * @param {cls.Log.IContent} message Content message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Content.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                return writer;
            };

            /**
             * Encodes the specified Content message, length delimited. Does not implicitly {@link cls.Log.Content.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cls.Log.Content
             * @static
             * @param {cls.Log.IContent} message Content message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Content.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Content message from the specified reader or buffer.
             * @function decode
             * @memberof cls.Log.Content
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cls.Log.Content} Content
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Content.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cls.Log.Content();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.key = reader.string();
                        break;
                    case 2:
                        message.value = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Content message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cls.Log.Content
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cls.Log.Content} Content
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Content.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Content message.
             * @function verify
             * @memberof cls.Log.Content
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Content.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.key != null && message.hasOwnProperty("key"))
                    if (!$util.isString(message.key))
                        return "key: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isString(message.value))
                        return "value: string expected";
                return null;
            };

            /**
             * Creates a Content message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cls.Log.Content
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cls.Log.Content} Content
             */
            Content.fromObject = function fromObject(object) {
                if (object instanceof $root.cls.Log.Content)
                    return object;
                var message = new $root.cls.Log.Content();
                if (object.key != null)
                    message.key = String(object.key);
                if (object.value != null)
                    message.value = String(object.value);
                return message;
            };

            /**
             * Creates a plain object from a Content message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cls.Log.Content
             * @static
             * @param {cls.Log.Content} message Content
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Content.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.key = "";
                    object.value = "";
                }
                if (message.key != null && message.hasOwnProperty("key"))
                    object.key = message.key;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this Content to JSON.
             * @function toJSON
             * @memberof cls.Log.Content
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Content.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Content;
        })();

        return Log;
    })();

    cls.LogTag = (function() {

        /**
         * Properties of a LogTag.
         * @memberof cls
         * @interface ILogTag
         * @property {string|null} [key] LogTag key
         * @property {string|null} [value] LogTag value
         */

        /**
         * Constructs a new LogTag.
         * @memberof cls
         * @classdesc Represents a LogTag.
         * @implements ILogTag
         * @constructor
         * @param {cls.ILogTag=} [properties] Properties to set
         */
        function LogTag(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogTag key.
         * @member {string} key
         * @memberof cls.LogTag
         * @instance
         */
        LogTag.prototype.key = "";

        /**
         * LogTag value.
         * @member {string} value
         * @memberof cls.LogTag
         * @instance
         */
        LogTag.prototype.value = "";

        /**
         * Creates a new LogTag instance using the specified properties.
         * @function create
         * @memberof cls.LogTag
         * @static
         * @param {cls.ILogTag=} [properties] Properties to set
         * @returns {cls.LogTag} LogTag instance
         */
        LogTag.create = function create(properties) {
            return new LogTag(properties);
        };

        /**
         * Encodes the specified LogTag message. Does not implicitly {@link cls.LogTag.verify|verify} messages.
         * @function encode
         * @memberof cls.LogTag
         * @static
         * @param {cls.ILogTag} message LogTag message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogTag.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
            return writer;
        };

        /**
         * Encodes the specified LogTag message, length delimited. Does not implicitly {@link cls.LogTag.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cls.LogTag
         * @static
         * @param {cls.ILogTag} message LogTag message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogTag.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LogTag message from the specified reader or buffer.
         * @function decode
         * @memberof cls.LogTag
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cls.LogTag} LogTag
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogTag.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cls.LogTag();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LogTag message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cls.LogTag
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cls.LogTag} LogTag
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogTag.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LogTag message.
         * @function verify
         * @memberof cls.LogTag
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LogTag.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            return null;
        };

        /**
         * Creates a LogTag message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cls.LogTag
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cls.LogTag} LogTag
         */
        LogTag.fromObject = function fromObject(object) {
            if (object instanceof $root.cls.LogTag)
                return object;
            var message = new $root.cls.LogTag();
            if (object.key != null)
                message.key = String(object.key);
            if (object.value != null)
                message.value = String(object.value);
            return message;
        };

        /**
         * Creates a plain object from a LogTag message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cls.LogTag
         * @static
         * @param {cls.LogTag} message LogTag
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LogTag.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.key = "";
                object.value = "";
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = message.key;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            return object;
        };

        /**
         * Converts this LogTag to JSON.
         * @function toJSON
         * @memberof cls.LogTag
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LogTag.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LogTag;
    })();

    cls.LogGroup = (function() {

        /**
         * Properties of a LogGroup.
         * @memberof cls
         * @interface ILogGroup
         * @property {Array.<cls.ILog>|null} [logs] LogGroup logs
         * @property {string|null} [contextFlow] LogGroup contextFlow
         * @property {string|null} [filename] LogGroup filename
         * @property {string|null} [source] LogGroup source
         * @property {Array.<cls.ILogTag>|null} [logTags] LogGroup logTags
         */

        /**
         * Constructs a new LogGroup.
         * @memberof cls
         * @classdesc Represents a LogGroup.
         * @implements ILogGroup
         * @constructor
         * @param {cls.ILogGroup=} [properties] Properties to set
         */
        function LogGroup(properties) {
            this.logs = [];
            this.logTags = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogGroup logs.
         * @member {Array.<cls.ILog>} logs
         * @memberof cls.LogGroup
         * @instance
         */
        LogGroup.prototype.logs = $util.emptyArray;

        /**
         * LogGroup contextFlow.
         * @member {string|null|undefined} contextFlow
         * @memberof cls.LogGroup
         * @instance
         */
        LogGroup.prototype.contextFlow = null;

        /**
         * LogGroup filename.
         * @member {string|null|undefined} filename
         * @memberof cls.LogGroup
         * @instance
         */
        LogGroup.prototype.filename = null;

        /**
         * LogGroup source.
         * @member {string|null|undefined} source
         * @memberof cls.LogGroup
         * @instance
         */
        LogGroup.prototype.source = null;

        /**
         * LogGroup logTags.
         * @member {Array.<cls.ILogTag>} logTags
         * @memberof cls.LogGroup
         * @instance
         */
        LogGroup.prototype.logTags = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * LogGroup _contextFlow.
         * @member {"contextFlow"|undefined} _contextFlow
         * @memberof cls.LogGroup
         * @instance
         */
        Object.defineProperty(LogGroup.prototype, "_contextFlow", {
            get: $util.oneOfGetter($oneOfFields = ["contextFlow"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * LogGroup _filename.
         * @member {"filename"|undefined} _filename
         * @memberof cls.LogGroup
         * @instance
         */
        Object.defineProperty(LogGroup.prototype, "_filename", {
            get: $util.oneOfGetter($oneOfFields = ["filename"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * LogGroup _source.
         * @member {"source"|undefined} _source
         * @memberof cls.LogGroup
         * @instance
         */
        Object.defineProperty(LogGroup.prototype, "_source", {
            get: $util.oneOfGetter($oneOfFields = ["source"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new LogGroup instance using the specified properties.
         * @function create
         * @memberof cls.LogGroup
         * @static
         * @param {cls.ILogGroup=} [properties] Properties to set
         * @returns {cls.LogGroup} LogGroup instance
         */
        LogGroup.create = function create(properties) {
            return new LogGroup(properties);
        };

        /**
         * Encodes the specified LogGroup message. Does not implicitly {@link cls.LogGroup.verify|verify} messages.
         * @function encode
         * @memberof cls.LogGroup
         * @static
         * @param {cls.ILogGroup} message LogGroup message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogGroup.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.logs != null && message.logs.length)
                for (var i = 0; i < message.logs.length; ++i)
                    $root.cls.Log.encode(message.logs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.contextFlow != null && Object.hasOwnProperty.call(message, "contextFlow"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.contextFlow);
            if (message.filename != null && Object.hasOwnProperty.call(message, "filename"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.filename);
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.source);
            if (message.logTags != null && message.logTags.length)
                for (var i = 0; i < message.logTags.length; ++i)
                    $root.cls.LogTag.encode(message.logTags[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LogGroup message, length delimited. Does not implicitly {@link cls.LogGroup.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cls.LogGroup
         * @static
         * @param {cls.ILogGroup} message LogGroup message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogGroup.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LogGroup message from the specified reader or buffer.
         * @function decode
         * @memberof cls.LogGroup
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cls.LogGroup} LogGroup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogGroup.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cls.LogGroup();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.logs && message.logs.length))
                        message.logs = [];
                    message.logs.push($root.cls.Log.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.contextFlow = reader.string();
                    break;
                case 3:
                    message.filename = reader.string();
                    break;
                case 4:
                    message.source = reader.string();
                    break;
                case 5:
                    if (!(message.logTags && message.logTags.length))
                        message.logTags = [];
                    message.logTags.push($root.cls.LogTag.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LogGroup message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cls.LogGroup
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cls.LogGroup} LogGroup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogGroup.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LogGroup message.
         * @function verify
         * @memberof cls.LogGroup
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LogGroup.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.logs != null && message.hasOwnProperty("logs")) {
                if (!Array.isArray(message.logs))
                    return "logs: array expected";
                for (var i = 0; i < message.logs.length; ++i) {
                    var error = $root.cls.Log.verify(message.logs[i]);
                    if (error)
                        return "logs." + error;
                }
            }
            if (message.contextFlow != null && message.hasOwnProperty("contextFlow")) {
                properties._contextFlow = 1;
                if (!$util.isString(message.contextFlow))
                    return "contextFlow: string expected";
            }
            if (message.filename != null && message.hasOwnProperty("filename")) {
                properties._filename = 1;
                if (!$util.isString(message.filename))
                    return "filename: string expected";
            }
            if (message.source != null && message.hasOwnProperty("source")) {
                properties._source = 1;
                if (!$util.isString(message.source))
                    return "source: string expected";
            }
            if (message.logTags != null && message.hasOwnProperty("logTags")) {
                if (!Array.isArray(message.logTags))
                    return "logTags: array expected";
                for (var i = 0; i < message.logTags.length; ++i) {
                    var error = $root.cls.LogTag.verify(message.logTags[i]);
                    if (error)
                        return "logTags." + error;
                }
            }
            return null;
        };

        /**
         * Creates a LogGroup message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cls.LogGroup
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cls.LogGroup} LogGroup
         */
        LogGroup.fromObject = function fromObject(object) {
            if (object instanceof $root.cls.LogGroup)
                return object;
            var message = new $root.cls.LogGroup();
            if (object.logs) {
                if (!Array.isArray(object.logs))
                    throw TypeError(".cls.LogGroup.logs: array expected");
                message.logs = [];
                for (var i = 0; i < object.logs.length; ++i) {
                    if (typeof object.logs[i] !== "object")
                        throw TypeError(".cls.LogGroup.logs: object expected");
                    message.logs[i] = $root.cls.Log.fromObject(object.logs[i]);
                }
            }
            if (object.contextFlow != null)
                message.contextFlow = String(object.contextFlow);
            if (object.filename != null)
                message.filename = String(object.filename);
            if (object.source != null)
                message.source = String(object.source);
            if (object.logTags) {
                if (!Array.isArray(object.logTags))
                    throw TypeError(".cls.LogGroup.logTags: array expected");
                message.logTags = [];
                for (var i = 0; i < object.logTags.length; ++i) {
                    if (typeof object.logTags[i] !== "object")
                        throw TypeError(".cls.LogGroup.logTags: object expected");
                    message.logTags[i] = $root.cls.LogTag.fromObject(object.logTags[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a LogGroup message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cls.LogGroup
         * @static
         * @param {cls.LogGroup} message LogGroup
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LogGroup.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.logs = [];
                object.logTags = [];
            }
            if (message.logs && message.logs.length) {
                object.logs = [];
                for (var j = 0; j < message.logs.length; ++j)
                    object.logs[j] = $root.cls.Log.toObject(message.logs[j], options);
            }
            if (message.contextFlow != null && message.hasOwnProperty("contextFlow")) {
                object.contextFlow = message.contextFlow;
                if (options.oneofs)
                    object._contextFlow = "contextFlow";
            }
            if (message.filename != null && message.hasOwnProperty("filename")) {
                object.filename = message.filename;
                if (options.oneofs)
                    object._filename = "filename";
            }
            if (message.source != null && message.hasOwnProperty("source")) {
                object.source = message.source;
                if (options.oneofs)
                    object._source = "source";
            }
            if (message.logTags && message.logTags.length) {
                object.logTags = [];
                for (var j = 0; j < message.logTags.length; ++j)
                    object.logTags[j] = $root.cls.LogTag.toObject(message.logTags[j], options);
            }
            return object;
        };

        /**
         * Converts this LogGroup to JSON.
         * @function toJSON
         * @memberof cls.LogGroup
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LogGroup.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LogGroup;
    })();

    cls.LogGroupList = (function() {

        /**
         * Properties of a LogGroupList.
         * @memberof cls
         * @interface ILogGroupList
         * @property {Array.<cls.ILogGroup>|null} [logGroupList] LogGroupList logGroupList
         */

        /**
         * Constructs a new LogGroupList.
         * @memberof cls
         * @classdesc Represents a LogGroupList.
         * @implements ILogGroupList
         * @constructor
         * @param {cls.ILogGroupList=} [properties] Properties to set
         */
        function LogGroupList(properties) {
            this.logGroupList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogGroupList logGroupList.
         * @member {Array.<cls.ILogGroup>} logGroupList
         * @memberof cls.LogGroupList
         * @instance
         */
        LogGroupList.prototype.logGroupList = $util.emptyArray;

        /**
         * Creates a new LogGroupList instance using the specified properties.
         * @function create
         * @memberof cls.LogGroupList
         * @static
         * @param {cls.ILogGroupList=} [properties] Properties to set
         * @returns {cls.LogGroupList} LogGroupList instance
         */
        LogGroupList.create = function create(properties) {
            return new LogGroupList(properties);
        };

        /**
         * Encodes the specified LogGroupList message. Does not implicitly {@link cls.LogGroupList.verify|verify} messages.
         * @function encode
         * @memberof cls.LogGroupList
         * @static
         * @param {cls.ILogGroupList} message LogGroupList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogGroupList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.logGroupList != null && message.logGroupList.length)
                for (var i = 0; i < message.logGroupList.length; ++i)
                    $root.cls.LogGroup.encode(message.logGroupList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LogGroupList message, length delimited. Does not implicitly {@link cls.LogGroupList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cls.LogGroupList
         * @static
         * @param {cls.ILogGroupList} message LogGroupList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogGroupList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LogGroupList message from the specified reader or buffer.
         * @function decode
         * @memberof cls.LogGroupList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cls.LogGroupList} LogGroupList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogGroupList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cls.LogGroupList();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.logGroupList && message.logGroupList.length))
                        message.logGroupList = [];
                    message.logGroupList.push($root.cls.LogGroup.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LogGroupList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cls.LogGroupList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cls.LogGroupList} LogGroupList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogGroupList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LogGroupList message.
         * @function verify
         * @memberof cls.LogGroupList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LogGroupList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.logGroupList != null && message.hasOwnProperty("logGroupList")) {
                if (!Array.isArray(message.logGroupList))
                    return "logGroupList: array expected";
                for (var i = 0; i < message.logGroupList.length; ++i) {
                    var error = $root.cls.LogGroup.verify(message.logGroupList[i]);
                    if (error)
                        return "logGroupList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a LogGroupList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cls.LogGroupList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cls.LogGroupList} LogGroupList
         */
        LogGroupList.fromObject = function fromObject(object) {
            if (object instanceof $root.cls.LogGroupList)
                return object;
            var message = new $root.cls.LogGroupList();
            if (object.logGroupList) {
                if (!Array.isArray(object.logGroupList))
                    throw TypeError(".cls.LogGroupList.logGroupList: array expected");
                message.logGroupList = [];
                for (var i = 0; i < object.logGroupList.length; ++i) {
                    if (typeof object.logGroupList[i] !== "object")
                        throw TypeError(".cls.LogGroupList.logGroupList: object expected");
                    message.logGroupList[i] = $root.cls.LogGroup.fromObject(object.logGroupList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a LogGroupList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cls.LogGroupList
         * @static
         * @param {cls.LogGroupList} message LogGroupList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LogGroupList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.logGroupList = [];
            if (message.logGroupList && message.logGroupList.length) {
                object.logGroupList = [];
                for (var j = 0; j < message.logGroupList.length; ++j)
                    object.logGroupList[j] = $root.cls.LogGroup.toObject(message.logGroupList[j], options);
            }
            return object;
        };

        /**
         * Converts this LogGroupList to JSON.
         * @function toJSON
         * @memberof cls.LogGroupList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LogGroupList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LogGroupList;
    })();

    return cls;
})();

module.exports = $root;
