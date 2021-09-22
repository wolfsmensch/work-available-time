const COUNTER_UPDATE_TIMEOUT = 500;
const HEAD_TITLE_POSTFIX = ' - workTime';

window.addEventListener( 'DOMContentLoaded', handleUI );

function handleUI()
{
    let headTitleElement = document.querySelector( 'head title' );
    let fieldEndTime = document.querySelector( '#end-time' );
    let fieldAvailableTime = document.querySelector( '#counter-box' );

    let targetTime = new getTargetTime( fieldEndTime.value );
    fieldEndTime.addEventListener( 'change', ( event ) => { targetTime = getTargetTime( event.target.value ) } );

    setTimeout( function updateCounter() {

        updateCounterUI( fieldAvailableTime, getAvailableTime( targetTime ), headTitleElement );
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

    let currentDateTime = new Date();
    let endDateTime = new Date();

    endDateTime.setHours( endTime.hours, endTime.minutes );

    let diffTime = new Date( endDateTime - currentDateTime );

    return new WorkTime( 
        Math.floor(diffTime / 3.6e6),
        Math.floor((diffTime % 3.6e6) / 6e4),
        Math.floor((diffTime % 6e4) / 1000)
    );
}

function updateCounterUI( field, time, title = undefined )
{
    let textHours = '--';
    let textMinutes = '--';
    let textSeconds = '--';

    if ( ( time.hours != undefined ) && ( time.minutes != undefined ) )
    {
        textHours = time.hours;
        textMinutes = time.minutes;
        textSeconds = time.seconds;

        if ( title != undefined )
        {
            title.innerText = `${textHours}:${textMinutes} ${HEAD_TITLE_POSTFIX}`;
        }
    }

    field.querySelector( '.hours' ).innerText = textHours;
    field.querySelector( '.minutes' ).innerText = textMinutes;
    field.querySelector( '.seconds' ).innerText = textSeconds;

}

function WorkTime( hours = undefined, minutes = undefined, seconds = undefined )
{
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
}