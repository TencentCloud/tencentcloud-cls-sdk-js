import * as $protobuf from "protobufjs";
/** Namespace cls. */
export namespace cls {

    /** Properties of a Log. */
    interface ILog {

        /** Log time */
        time?: (number|Long|null);

        /** Log contents */
        contents?: (cls.Log.IContent[]|null);
    }

    /** Represents a Log. */
    class Log implements ILog {

        /**
         * Constructs a new Log.
         * @param [properties] Properties to set
         */
        constructor(properties?: cls.ILog);

        /** Log time. */
        public time: (number|Long);

        /** Log contents. */
        public contents: cls.Log.IContent[];

        /**
         * Creates a new Log instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Log instance
         */
        public static create(properties?: cls.ILog): cls.Log;

        /**
         * Encodes the specified Log message. Does not implicitly {@link cls.Log.verify|verify} messages.
         * @param message Log message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cls.ILog, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Log message, length delimited. Does not implicitly {@link cls.Log.verify|verify} messages.
         * @param message Log message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cls.ILog, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Log message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Log
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cls.Log;

        /**
         * Decodes a Log message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Log
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cls.Log;

        /**
         * Verifies a Log message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Log message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Log
         */
        public static fromObject(object: { [k: string]: any }): cls.Log;

        /**
         * Creates a plain object from a Log message. Also converts values to other types if specified.
         * @param message Log
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cls.Log, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Log to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Log {

        /** Properties of a Content. */
        interface IContent {

            /** Content key */
            key?: (string|null);

            /** Content value */
            value?: (string|null);
        }

        /** Represents a Content. */
        class Content implements IContent {

            /**
             * Constructs a new Content.
             * @param [properties] Properties to set
             */
            constructor(properties?: cls.Log.IContent);

            /** Content key. */
            public key: string;

            /** Content value. */
            public value: string;

            /**
             * Creates a new Content instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Content instance
             */
            public static create(properties?: cls.Log.IContent): cls.Log.Content;

            /**
             * Encodes the specified Content message. Does not implicitly {@link cls.Log.Content.verify|verify} messages.
             * @param message Content message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: cls.Log.IContent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Content message, length delimited. Does not implicitly {@link cls.Log.Content.verify|verify} messages.
             * @param message Content message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: cls.Log.IContent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Content message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Content
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cls.Log.Content;

            /**
             * Decodes a Content message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Content
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cls.Log.Content;

            /**
             * Verifies a Content message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Content message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Content
             */
            public static fromObject(object: { [k: string]: any }): cls.Log.Content;

            /**
             * Creates a plain object from a Content message. Also converts values to other types if specified.
             * @param message Content
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: cls.Log.Content, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Content to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a LogTag. */
    interface ILogTag {

        /** LogTag key */
        key?: (string|null);

        /** LogTag value */
        value?: (string|null);
    }

    /** Represents a LogTag. */
    class LogTag implements ILogTag {

        /**
         * Constructs a new LogTag.
         * @param [properties] Properties to set
         */
        constructor(properties?: cls.ILogTag);

        /** LogTag key. */
        public key: string;

        /** LogTag value. */
        public value: string;

        /**
         * Creates a new LogTag instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogTag instance
         */
        public static create(properties?: cls.ILogTag): cls.LogTag;

        /**
         * Encodes the specified LogTag message. Does not implicitly {@link cls.LogTag.verify|verify} messages.
         * @param message LogTag message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cls.ILogTag, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LogTag message, length delimited. Does not implicitly {@link cls.LogTag.verify|verify} messages.
         * @param message LogTag message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cls.ILogTag, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogTag message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogTag
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cls.LogTag;

        /**
         * Decodes a LogTag message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LogTag
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cls.LogTag;

        /**
         * Verifies a LogTag message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LogTag message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LogTag
         */
        public static fromObject(object: { [k: string]: any }): cls.LogTag;

        /**
         * Creates a plain object from a LogTag message. Also converts values to other types if specified.
         * @param message LogTag
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cls.LogTag, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LogTag to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LogGroup. */
    interface ILogGroup {

        /** LogGroup logs */
        logs?: (cls.ILog[]|null);

        /** LogGroup contextFlow */
        contextFlow?: (string|null);

        /** LogGroup filename */
        filename?: (string|null);

        /** LogGroup source */
        source?: (string|null);

        /** LogGroup logTags */
        logTags?: (cls.ILogTag[]|null);
    }

    /** Represents a LogGroup. */
    class LogGroup implements ILogGroup {

        /**
         * Constructs a new LogGroup.
         * @param [properties] Properties to set
         */
        constructor(properties?: cls.ILogGroup);

        /** LogGroup logs. */
        public logs: cls.ILog[];

        /** LogGroup contextFlow. */
        public contextFlow?: (string|null);

        /** LogGroup filename. */
        public filename?: (string|null);

        /** LogGroup source. */
        public source?: (string|null);

        /** LogGroup logTags. */
        public logTags: cls.ILogTag[];

        /** LogGroup _contextFlow. */
        public _contextFlow?: "contextFlow";

        /** LogGroup _filename. */
        public _filename?: "filename";

        /** LogGroup _source. */
        public _source?: "source";

        /**
         * Creates a new LogGroup instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogGroup instance
         */
        public static create(properties?: cls.ILogGroup): cls.LogGroup;

        /**
         * Encodes the specified LogGroup message. Does not implicitly {@link cls.LogGroup.verify|verify} messages.
         * @param message LogGroup message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cls.ILogGroup, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LogGroup message, length delimited. Does not implicitly {@link cls.LogGroup.verify|verify} messages.
         * @param message LogGroup message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cls.ILogGroup, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogGroup message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogGroup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cls.LogGroup;

        /**
         * Decodes a LogGroup message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LogGroup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cls.LogGroup;

        /**
         * Verifies a LogGroup message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LogGroup message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LogGroup
         */
        public static fromObject(object: { [k: string]: any }): cls.LogGroup;

        /**
         * Creates a plain object from a LogGroup message. Also converts values to other types if specified.
         * @param message LogGroup
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cls.LogGroup, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LogGroup to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LogGroupList. */
    interface ILogGroupList {

        /** LogGroupList logGroupList */
        logGroupList?: (cls.ILogGroup[]|null);
    }

    /** Represents a LogGroupList. */
    class LogGroupList implements ILogGroupList {

        /**
         * Constructs a new LogGroupList.
         * @param [properties] Properties to set
         */
        constructor(properties?: cls.ILogGroupList);

        /** LogGroupList logGroupList. */
        public logGroupList: cls.ILogGroup[];

        /**
         * Creates a new LogGroupList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogGroupList instance
         */
        public static create(properties?: cls.ILogGroupList): cls.LogGroupList;

        /**
         * Encodes the specified LogGroupList message. Does not implicitly {@link cls.LogGroupList.verify|verify} messages.
         * @param message LogGroupList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cls.ILogGroupList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LogGroupList message, length delimited. Does not implicitly {@link cls.LogGroupList.verify|verify} messages.
         * @param message LogGroupList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cls.ILogGroupList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogGroupList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogGroupList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cls.LogGroupList;

        /**
         * Decodes a LogGroupList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LogGroupList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cls.LogGroupList;

        /**
         * Verifies a LogGroupList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LogGroupList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LogGroupList
         */
        public static fromObject(object: { [k: string]: any }): cls.LogGroupList;

        /**
         * Creates a plain object from a LogGroupList message. Also converts values to other types if specified.
         * @param message LogGroupList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cls.LogGroupList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LogGroupList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
