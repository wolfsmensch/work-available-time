'use strict';

const HTML_QUERY_PRESETS = '#time-presets';

window.addEventListener( 'DOMContentLoaded', () => {
    attachPresetsUI();
});

function attachPresetsUI()
{
    let presetsBox = document.querySelector( HTML_QUERY_PRESETS );
    let timeField = document.querySelector( HTML_QUERY_END_TIME );

    presetsBox.addEventListener( 'click', (event) => {
        if ( event.target.nodeName == "BUTTON" )
        {
            procPreset( event.target, timeField );
        }
    });
}

function procPreset( presetBtn, timeField )
{
    let operationType = presetBtn.dataset.direction;
    let operationValue = Number( presetBtn.dataset.value );

    if ( isNaN( operationValue ) )
    {
        console.log( "Incorrect preset value: " + presetBtn.dataset.value );
        return;
    }

    let targetTime = getTargetTime( timeField.value );

    let endTime = moment();
    endTime.hour( targetTime.hours ).minute( targetTime.minutes ).second( 0 );

    if ( operationType == 'sub' )
    {
        endTime.subtract( operationValue, 'm' );
    }
    else if ( operationType == 'add' )
    {
        endTime.add( operationValue, 'm' );
    }

    let newTime = new Time( endTime.hours(), endTime.minutes() );

    timeField.value = newTime.toShortString();
    timeField.dispatchEvent( new Event( 'change' ) );
}