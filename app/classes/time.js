export default class {
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

    static fromText( timeText )
    {
        if ( ( timeText != undefined ) && ( timeText.length > 0 ) )
        {
            let timeElements = timeText.trim().split( ':' );
            if ( timeElements.length == 2 )
            {
                timeElements[0] = Number( timeElements[0] );
                timeElements[1] = Number( timeElements[1] );

                if ( this.isValid( timeElements[0], timeElements[1] ) )
                {
                    return new this( timeElements[0], timeElements[1] );
                }
            }
        }

        return new this();
    }

    static isValid( hours, minutes )
    {
        if ( ( hours == undefined ) || ( hours > 23 ) || ( hours < 0 ) )
        {
            return false;
        }

        if ( (minutes == undefined) || ( minutes > 59 ) || ( minutes < 0 ) )
        {
            return false;
        }

        return true;
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