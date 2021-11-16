class Time {
    constructor( hours = undefined, minutes = undefined, seconds = undefined )
    {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    static elementToText(time) {
        if (time == undefined) {
            return '--';
        }
        else if (time < 0) {
            time = 0;
        }

        return time >= 10 ? time : '0' + String(time);
    }

    toHumanText() {
        if (this.hours > 0) {
            return `${this.constructor.elementToText(this.hours)}:${this.constructor.elementToText(this.minutes)}`;
        }
        else if (this.minutes > 0) {
            return `${this.minutes} min`;
        }
        else if (this.seconds > 0) {
            return `${this.seconds} sec`;
        }
        else {
            return 'Finish';
        }
    }

    toShortString() {
        return this.constructor.elementToText(this.hours) + ':' + this.constructor.elementToText(this.minutes);
    }

    correctTime(timeElement) {
        if ((timeElement == undefined) || (timeElement < 0)) {
            return undefined;
        }

        return timeElement > 0 ? timeElement : 0;
    }

    get hours() {
        return this._hours;
    }

    set hours(value) {
        this._hours = this.correctTime(value);
    }

    get minutes() {
        return this._minutes;
    }

    set minutes(value) {
        this._minutes = this.correctTime(value);
    }

    get seconds() {
        return this._seconds;
    }

    set seconds(value) {
        this._seconds = this.correctTime(value);
    }

    get hoursText()
    {
        return this.constructor.elementToText( this.hours );
    }

    get minutesText()
    {
        return this.constructor.elementToText( this.minutes );
    }

    get secondsText()
    {
        return this.constructor.elementToText( this.seconds );
    }
}