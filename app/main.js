import Time from "./classes/time.js";
import TimerUI from "./classes/timerUI.js";
import PresetsUI from "./classes/presetsUI.js";
import TimeStorage from "./classes/storage.js";

const COUNTER_UPDATE_TIMEOUT = 500;
const HEAD_TITLE_POSTFIX = ' - Priority Hour';

const HTML_QUERY_END_TIME = '#end-time';
const HTML_QUERY_COUNTER_BOX = '#counter-box';
const HTML_QUERY_PRESETS = '#time-presets';

setTimeout(() => {
    let timerUI = new TimerUI( HTML_QUERY_END_TIME, HTML_QUERY_COUNTER_BOX, HEAD_TITLE_POSTFIX );
    let presetsBox = new PresetsUI( HTML_QUERY_PRESETS, HTML_QUERY_END_TIME );

    let targetTime = Time.fromText( timerUI.endTime );
    if ( targetTime.hours == undefined )
    {
        targetTime = TimeStorage.get();
        if ( Time.isValid( targetTime.hours, targetTime.minutes ) )
        {
            timerUI.endTime = targetTime.toShortString();
        }
    }

    timerUI.onEndTimeChanged = function()
    {
        targetTime = Time.fromText( timerUI.endTime );

        if ( Time.isValid( targetTime.hours, targetTime.minutes ) )
        {
            TimeStorage.save( targetTime );
        }
    }

    timerUI.handleEvents();
    presetsBox.handleEvents();

    setTimeout( function updateCounter() {

        timerUI.update( getAvailableTime( targetTime ) );
        setTimeout( updateCounter, COUNTER_UPDATE_TIMEOUT );

    }, 0 );

    // TODO: Отключение анимации загрузки
}, 0);

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


