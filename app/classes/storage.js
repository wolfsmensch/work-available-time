import Time from "./time.js";

const LOCAL_STORAGE_END_TIME_KEY = 'endTime';

export default class {
    
    static save( time )
    {
        if ( ( time.hours == undefined ) || ( time.minutes == undefined ) )
        {
            return;
        }
    
        localStorage.setItem( LOCAL_STORAGE_END_TIME_KEY, `${time.toShortString()}` );
    }

    static get()
    {
        let localTime = localStorage.getItem( LOCAL_STORAGE_END_TIME_KEY );
        if ( ( localTime == null ) || ( localTime == undefined ) )
        {
            return new Time();
        }
        
        return Time.fromText( localTime );
    }

}