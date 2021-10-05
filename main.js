'use strict';

const COUNTER_UPDATE_TIMEOUT = 500;
const HEAD_TITLE_POSTFIX = ' - Time';

const HTML_QUERY_END_TIME = '#end-time';
const HTML_QUERY_TITLE = 'head title';
const HTML_QUERY_COUNTER_BOX = '#counter-box';

const LOCAL_STORAGE_END_TIME_KEY = 'endTime';

window.addEventListener( 'DOMContentLoaded', handleUI );

function handleUI()
{
    let fieldEndTime = document.querySelector( HTML_QUERY_END_TIME );

    let targetTime = getTargetTime( fieldEndTime.value );
    if ( targetTime.hours == undefined )
    {
        targetTime = getLocalTime();
        if ( validateTime( targetTime.hours, targetTime.minutes ) )
        {
            setUITargetTime( `${targetTime.toShortString()}` );
        }
    }

    fieldEndTime.addEventListener( 'change', ( event ) => { 
        targetTime = getTargetTime( event.target.value );

        if ( validateTime( targetTime.hours, targetTime.minutes ) )
        {
            saveLocalTime( targetTime );
        }
    });

    setTimeout( function updateCounter() {

        updateCounterUI( getAvailableTime( targetTime ) );
        setTimeout( updateCounter, COUNTER_UPDATE_TIMEOUT );

    }, 0 );
}


function getTargetTime( timeText )
{
    if ( timeText.length > 0 )
    {
        let timeElements = timeText.trim().split( ':' );
        if ( timeElements.length == 2 )
        {
            timeElements[0] = Number( timeElements[0] );
            timeElements[1] = Number( timeElements[1] );

            if ( validateTime( timeElements[0], timeElements[1] ) )
            {
                return new Time( timeElements[0], timeElements[1] );
            }
        }
    }

    return new Time();
}

function validateTime( hours, minutes )
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

function getAvailableTime( endTime )
{
    if ( ( endTime.hours == undefined ) || ( endTime.minutes == undefined ) )
    {
        return new Time();
    }

    let currentDateTime = moment();
    let endDateTime = moment();

    endDateTime.hour( endTime.hours ).minute( endTime.minutes ).second( 0 );

    let diffTime =  moment.duration( endDateTime.diff( currentDateTime ) );

    return new Time( 
        diffTime.hours(),
        diffTime.minutes(),
        diffTime.seconds()
    );
}

function updateCounterUI( time )
{ 
    let headTitleElement = document.querySelector( HTML_QUERY_TITLE );
    let fieldAvailableTime = document.querySelector( HTML_QUERY_COUNTER_BOX );

    updateCounterTitleTUI( headTitleElement, time );
    updateCounterTimerUI( fieldAvailableTime, time );
}

function updateCounterTimerUI( field, time )
{
    field.querySelector( '.hours' ).innerText = time.hoursText;
    field.querySelector( '.minutes' ).innerText = time.minutesText;
    field.querySelector( '.seconds' ).innerText = time.secondsText;
}

function updateCounterTitleTUI( field, time )
{
    if ( field != undefined )
    {
        field.innerText = `${time.toHumanText()} ${HEAD_TITLE_POSTFIX}`;
    }
}

function setUITargetTime( timeString )
{
    let editFields = document.querySelector( HTML_QUERY_END_TIME );
    if ( editFields != undefined )
    {
        editFields.value = timeString;
    }
}

function saveLocalTime( time )
{
    if ( ( time.hours == undefined ) || ( time.minutes == undefined ) )
    {
        return;
    }

    localStorage.setItem( LOCAL_STORAGE_END_TIME_KEY, `${time.toShortString()}` );
}

function getLocalTime()
{
    let localTime = localStorage.getItem( LOCAL_STORAGE_END_TIME_KEY );
    if ( ( localTime == null ) || ( localTime == undefined ) )
    {
        return new Time();
    }
    
    return getTargetTime( localTime );
}

// Time object constructor
function Time( hours = undefined, minutes = undefined, seconds = undefined )
{
    this.elementToText = function ( time )
    {
        if ( ( time == undefined ) || ( time < 0 ) )
        {
            return '--';
        }

        return time >= 10 ? time : '0' + String( time );
    }

    this.toHumanText = function ()
    {
        if ( this.hours > 0 )
        {
            return `${this.elementToText(this.hours)}:${this.elementToText(this.minutes)}`;
        }
        else if ( this.minutes > 0 )
        {
            return `${this.minutes} min`;
        }
        else if ( this.seconds > 0 )
        {
            return `${this.seconds} sec`;
        }
        else
        {
            return 'Finish';
        }
    }

    this.correctTime = function( timeElement )
    {
        if ( timeElement == undefined )
        {
            return undefined;
        }

        return timeElement > 0 ? timeElement : 0;
    }
    
    this.toShortString = function()
    {
        return this.elementToText( this.hours ) + ':' + this.elementToText( this.minutes );
    }

    Object.defineProperty( this, 'hours', {
        get()
        {
            return this._hours;
        },

        set( value )
        {
            this._hours = this.correctTime( value );
        }
    });

    Object.defineProperty( this, 'minutes', {
        get()
        {
            return this._minutes;
        },

        set( value )
        {
            this._minutes = this.correctTime( value );
        }
    });

    Object.defineProperty( this, 'seconds', {
        get()
        {
            return this._seconds;
        },

        set( value )
        {
            this._seconds = this.correctTime( value );
        }
    });

    Object.defineProperty( this, 'hoursText', {
        get()
        {
            return this.elementToText( hours );
        }
    });

    Object.defineProperty( this, 'minutesText', {
        get()
        {
            return this.elementToText( minutes );
        }
    });

    Object.defineProperty( this, 'secondsText', {
        get()
        {
            return this.elementToText( seconds );
        }
    });

    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
}