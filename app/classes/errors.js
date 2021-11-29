class UIError extends Error {

    constructor( message )
    {
        super( message );
        this.name = 'UIError';
    }

}

export {UIError};