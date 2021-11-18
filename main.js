'use strict';

const COUNTER_UPDATE_TIMEOUT = 500;
const HEAD_TITLE_POSTFIX = ' - Priority Hour';

const HTML_QUERY_END_TIME = '#end-time';
const HTML_QUERY_TITLE = 'head title';
const HTML_QUERY_COUNTER_BOX = '#counter-box';
const HTML_QUERY_PRESETS = '#time-presets';

window.addEventListener( 'DOMContentLoaded', handleUI );

function handleUI()
{
    let fieldEndTime = document.querySelector( HTML_QUERY_END_TIME );

    let targetTime = Time.fromText( fieldEndTime.value );
    if ( targetTime.hours == undefined )
    {
        targetTime = TimeStorage.get();
        if ( Time.isValid( targetTime.hours, targetTime.minutes ) )
        {
            setUITargetTime( `${targetTime.toShortString()}` );
        }
    }

    fieldEndTime.addEventListener( 'change', ( event ) => { 
        targetTime = Time.fromText( event.target.value );

        if ( Time.isValid( targetTime.hours, targetTime.minutes ) )
        {
            TimeStorage.save( targetTime );
        }
    });

    let presetsBox = new PresetsUI( HTML_QUERY_PRESETS, HTML_QUERY_END_TIME );
    presetsBox.handleEvents();

    setTimeout( function updateCounter() {

        updateCounterUI( getAvailableTime( targetTime ) );
        setTimeout( updateCounter, COUNTER_UPDATE_TIMEOUT );

    }, 0 );
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

