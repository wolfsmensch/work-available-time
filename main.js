const COUNTER_UPDATE_TIMEOUT = 500;
const HEAD_TITLE_POSTFIX = ' - workTime';

const HTML_QUERY_TITLE = 'head title';
const HTML_QUERY_COUNTER_BOX = '#counter-box';

window.addEventListener( 'DOMContentLoaded', handleUI );

function handleUI()
{
    let fieldEndTime = document.querySelector( '#end-time' );

    let targetTime = new getTargetTime( fieldEndTime.value );
    fieldEndTime.addEventListener( 'change', ( event ) => { targetTime = getTargetTime( event.target.value ) } );

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
                return new WorkTime( timeElements[0], timeElements[1] );
            }
        }
    }

    return new WorkTime();
}

function validateTime( hours, minutes )
{
    if ( ( hours > 23 ) || ( hours < 0 ) )
    {
        return false;
    }

    if ( ( minutes > 59 ) || ( minutes < 0 ) )
    {
        return false;
    }

    return true;
}

function getAvailableTime( endTime )
{
    if ( ( endTime.hours == undefined ) || ( endTime.minutes == undefined ) )
    {
        return new WorkTime();
    }

    let currentDateTime = moment();
    let endDateTime = moment();

    endDateTime.hour( endTime.hours ).minute( endTime.minutes ).second( 0 );

    let diffTime =  moment.duration( endDateTime.diff( currentDateTime ) );

    return new WorkTime( 
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
    field.querySelector( '.hours' ).innerText = time.elementToText( time.hours );
    field.querySelector( '.minutes' ).innerText = time.elementToText( time.minutes );
    field.querySelector( '.seconds' ).innerText = time.elementToText( time.seconds );
}

function updateCounterTitleTUI( field, time )
{
    if ( field != undefined )
    {
        field.innerText = `${time.toHumanText()} ${HEAD_TITLE_POSTFIX}`;
    }
}

function WorkTime( hours = undefined, minutes = undefined, seconds = undefined )
{
    this.hours = hours > 0 ? hours : 0;
    this.minutes = minutes > 0 ? minutes : 0;
    this.seconds = seconds > 0 ? seconds : 0;

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
}