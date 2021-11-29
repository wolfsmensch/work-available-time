import Time from './time.js';

export default class {
    _presetsBox = undefined;
    _timeField = undefined;

    constructor( presetsNodeSelector, timeFieldNodeSelector )
    {
        this._presetsBox = document.querySelector( presetsNodeSelector );
        this._timeField = document.querySelector( timeFieldNodeSelector );
    }

    handleEvents()
    {
        this._presetsBox = addEventListener( 'click', (event) => {
            if ( event.target.nodeName == "BUTTON" )
            {
                this.procPreset( event.target );
            }
        });
    }

    procPreset( presetBtn )
    {
        let operationType = presetBtn.dataset.direction;
        let operationValue = Number( presetBtn.dataset.value );

        if ( isNaN( operationValue ) )
        {
            console.log( "Incorrect preset value: " + presetBtn.dataset.value );
            return;
        }

        let targetTime = Time.fromText( this._timeField.value );

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

        this._timeField.value = newTime.toShortString();
        this._timeField.dispatchEvent( new Event( 'change' ) );
    }
}