function absPercentText(value, leftPole, rightPole) {
    var poleName = (value < 0) ? leftPole : rightPole;
    return Math.round(Math.abs(value) * 50 + 50) + "% " + poleName;
}

Params.prototype.sexDescription = function() {
    var suffix = (this.sexChange == true) ? " (had sex change)" : "";
    return absPercentText(this.sex, "female", "male") + suffix;
}

Params.prototype.genderDescription = function() {
    return absPercentText(this.gender, "woman", "man");
}

Params.prototype.orientationDescription = function() {
    if(this.noOrientation) {
        return "none";
    }
    var suffix = (this.acceptSexChange == true) ? " (opt. sex change)" : "";
    return absPercentText(this.orientation, "female", "male") + suffix;
}

Params.prototype.fullDescription = function() {
    var result = "";
    result += "Sex: " + this.sexDescription();
    result += "\nGender: " + this.genderDescription();
    result += "\nOrientation: " + this.orientationDescription();

    return result;
}