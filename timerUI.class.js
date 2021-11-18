const HTML_QUERY_TITLE = 'head title';

class TimerUI {

    _endTimeField = undefined;
    _pageTitle = undefined;
    _availableTimeField = undefined;

    _pageTitlePostfix = '';

    onEndTimeChanged = null;

    constructor( endTimeFieldSelector, availableTimeFieldSelector, pageTitlePostfix )
    {
        this._endTimeField = document.querySelector( endTimeFieldSelector );
        this._pageTitle = document.querySelector( HTML_QUERY_TITLE );
        this._availableTimeField = document.querySelector( availableTimeFieldSelector );

        if ( ( this._endTimeField == undefined ) || ( this._pageTitle == undefined ) || ( this._availableTimeField == undefined ) )
        {
            throw new UIError( 'Не удалось подключить элементы интерфейса' );
        }

        this._pageTitlePostfix = pageTitlePostfix;
    }

    handleEvents()
    {
        this._endTimeField.addEventListener( 'change', this.onEndTimeChanged );
    }

    update( time )
    {
        this._updateTimer( time );
        this._updatePageTitle( time );
    }

    _updateTimer( time )
    {
        this._availableTimeField.querySelector( '.hours' ).innerText = time.hoursText;
        this._availableTimeField.querySelector( '.minutes' ).innerText = time.minutesText;
        this._availableTimeField.querySelector( '.seconds' ).innerText = time.secondsText;
    }

    _updatePageTitle( time )
    {
        this._pageTitle.innerText = `${time.toHumanText()} ${this._pageTitlePostfix}`;
    }

    set endTime( value )
    {
        this._endTimeField.value = value;
    }

    get endTime()
    {
        return this._endTimeField.value;
    }
}

class UIError extends Error {

    constructor( message )
    {
        super( message );
        this.name = 'UIError';
    }

}
