"use strict";
// utils
function isIterable(val) {
    return Symbol.iterator in Object(val);
}

function check_type(val, expected_type) {
    if (expected_type === "iterable") {
        if (!isIterable(val)) {
            let vstr = val.toString();
            throw "argument " + vstr + " must be of type " + expected_type;
        }
    } else if (typeof val !== expected_type) {
        let vstr = val.toString();
        throw "argument " + vstr + " must be of type " + expected_type;
    }
    return true;
}


function first_token_fn(str, token, boolfn, pos = null) {
    let ival = 0;
    if (pos !== null) {
        ival = pos;
    }
    for (var index = ival; index < str.length; index++) {
        if (boolfn(str[index], token)) {
            return index;
        }
    }
    return -1;

}

function last_token_fn(str, token, boolfn, pos = null) {
    var last = -1;
    let ival = 0;
    if (pos !== null) {
        ival = pos;
    }
    for (var index = ival; index < str.length; index++) {

        if (boolfn(str[key], token)) {
            last = key;
        }
    }
    return last;
}

function first_not_of(str, token, pos = null) {
    return first_token_fn(str, token, (a, b) => {
        return a !== b;
    }, pos);
}

function first_of(str, token, pos = null) {
    return first_token_fn(str, token, (a, b) => {
        return a === b;
    }, pos);
}

function last_not_of(str, token, pos = null) {
    return last_token_fn(str, token, (a, b) => {
        return a !== b;
    }, pos);
}

function last_of(str, token, pos = null) {
    return last_token_fn(str, token, (a, b) => {
        return a === b;
    }, pos);
}

function tail_str(str) {
    let token_start = first_not_of(str, " \t");
    let space_start = first_of(str, " \t", token_start);
    let tail_start = first_not_of(str, " \t", space_start);
    let tail_end = last_not_of(str, " \t");
    if (tail_start !== -1 && tail_end !== -1) {
        return str.substring(tail_start, tail_end - tail_start + 1);
    } else if (tail_start !== -1) {
        return str.substring(tail_start);
    }
    return "";
}

function firstToken(str) {
    if (str !== "") {
        let token_start = first_not_of(str, " \t");
        let token_end = first_of(str, " \t", token_start);
        if (token_start != -1 && token_end != -1) {
            return str.substring(token_start, token_end - token_start);
        } else if (token_start != -1) {
            return str.substring(token_start);
        }
    }
    return "";
}
