function Params() {
    this.sex = Math.random() * 2. - 1;
    this.gender = Math.random() * 2. - 1;
    this.orientation = Math.random() * 2. - 1;
    this.sexChange = false;
    this.acceptSexChange = true;
    this.noOrientation = false;
}

function isSet(val, bit) {
    if ((val & (1 << bit)) > 0)
        return 1;
    else
        return 0;
}

function combineBits(source, indices) {
    var shiftCount = indices.length - 1;
    var result = 0;
    var i;
    for (i = 0; i < indices.length; i++) {
        result |= isSet(source, indices[i]) << i;
    }

    var maxVal = (1 << indices.length) - 1;
    return (result / (maxVal * .5) - 1.);
}

function shuffleBits(value, indices) {
    var result = 0;
    var maxValue = (1 << indices.length) - 1;
    var intValue = Math.round((value + 1.) * maxValue * .5);

    var i = 0;
    for (i = 0; i < indices.length; i++) {
        result |= isSet(intValue, i) << indices[i];
    }

    return result;
}

function base64AddPadding(str) {
    return str + Array((4 - str.length % 4) % 4 + 1).join('=');
}

String.prototype.hexEncode = function () {
    var hex, i;
    var result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += (hex);
    }
    return result
};

Params.prototype.fromUrlParam = function (base64) {
    base64 = base64.replace(/_/g, '/').replace(/-/g, '+');
    base64 = base64AddPadding(base64);
    if (typeof window === "undefined") {
        var data = new Buffer(base64, 'base64');
        var urlParam = parseInt(data.toString('hex'), 16);
    } else {
        var data = atob(base64);
        var urlParam = parseInt(data.hexEncode(), 16);
    }
    urlParam = urlParam & 0xFFFFFFFF;
    var version = (urlParam >> 31) | (urlParam >> 30);
    if (version != 0) {
        console.log("unknown url params version");
    }
    this.sex = combineBits(urlParam, [8, 4, 21, 17, 12, 19, 5, 29, 10]);
    this.gender = combineBits(urlParam, [27, 1, 25, 6, 3, 14, 15, 22, 26]);
    this.orientation = combineBits(urlParam, [2, 0, 18, 28, 9, 23, 11, 20, 24]);
    this.sexChange = isSet(urlParam, 7) ? true : false;
    this.acceptSexChange = isSet(urlParam, 16) ? true : false;
    this.noOrientation = isSet(urlParam, 13) ? true : false;
};

var toBytesInt32 = function (num) {
    var ascii = '';
    for (let i = 3; i >= 0; i--) {
        ascii += String.fromCharCode((num >> (8 * i)) & 255);
    }
    return ascii;
};


Params.prototype.toUrlParam = function () {
    var result = 0;
    result |= shuffleBits(this.sex, [8, 4, 21, 17, 12, 19, 5, 29, 10]);
    result |= shuffleBits(this.gender, [27, 1, 25, 6, 3, 14, 15, 22, 26]);
    result |= shuffleBits(this.orientation, [2, 0, 18, 28, 9, 23, 11, 20, 24]);
    result |= ((this.sexChange == true ? 1 : 0) << 7);
    result |= ((this.acceptSexChange == true ? 1 : 0) << 16);
    result |= ((this.noOrientation == true ? 1 : 0) << 13);
    result = toBytesInt32(result);
    return btoa(result).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, "");
};

module.exports = {
    Params: Params
};