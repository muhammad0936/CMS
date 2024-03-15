import { BOOLEAN, INTEGER, STRING } from 'sequelize';
import sequelize from '../util/database.mjs';

const element = sequelize.define('element', {
    _id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
    elementName: {
        type: STRING,
        allowNull : false
    },
    order: {
        type: INTEGER,
        allowNull: false
    },
    // Here i can know exactly where the element is:
    content: STRING(5000),
    accesskey: STRING,
    autocapitalize: STRING,
    autofocus: BOOLEAN,
    class: STRING,
    contenteditable: BOOLEAN,
    contextmenu: STRING,
    dir: STRING,
    draggable: BOOLEAN,
    hidden: BOOLEAN,
    id: STRING,
    lang: STRING,
    spellcheck: BOOLEAN,
    style: STRING,
    tabindex: INTEGER,
    title: STRING,
    translate: BOOLEAN,
    // <a> element specific attributes
    href: STRING,
    target: STRING,
    download: STRING,
    ping: STRING,
    rel: STRING,
    hreflang: STRING,

    // <img> element specific attributes
    src: STRING,
    alt: STRING,
    height: INTEGER,
    width: INTEGER,
    usemap: STRING,
    ismap: BOOLEAN,

    // <input> element specific attributes
    accept: STRING,
    alt: STRING,
    autocomplete: STRING,
    autofocus: BOOLEAN,
    checked: BOOLEAN,
    dirname: STRING,
    disabled: BOOLEAN,
    form: STRING,
    formaction: STRING,
    formenctype: STRING,
    formmethod: STRING,
    formnovalidate: BOOLEAN,
    formtarget: STRING,
    height: INTEGER,
    list: STRING,
    max: INTEGER,
    maxlength: INTEGER,
    min: INTEGER,
    minlength: INTEGER,
    multiple: BOOLEAN,
    name: STRING,
    pattern: STRING,
    placeholder: STRING,
    readonly: BOOLEAN,
    required: BOOLEAN,
    size: INTEGER,
    src: STRING,
    step: INTEGER,
    type: STRING,
    value: STRING,
    width: INTEGER
    }, {})


    export default element;