/* SynBioHub Federator
 * Web of Registries
 *
 * SynBioHub object class
 *
 * Written by Zach Zundel
 * 16-06-2017
 */

class SynBioHub {
    private _uriPrefix: String;
    private _instanceUrl: String;

    public constructor(uriPrefix: String, instanceUrl: String, validate: Boolean = true) {
        // Verify that this SynBioHub instance is valid
        if(validate) {
            this.check(uriPrefix, instanceUrl);
        }
    
        this._uriPrefix = uriPrefix;
        this._instanceUrl = instanceUrl;
    }

    public get uriPrefix(): String {
        return this._uriPrefix;
    }
    
    public set uriPrefix(uriPrefix: String) {
        // Verify that this change doesn't break the reference
        this.check(uriPrefix, this.instanceUrl);

        this._uriPrefix = uriPrefix;
    }

    public get instanceUrl(): String {
        return this._instanceUrl;
    }

    public set instanceUrl(instanceUrl: String) {
        // Verify that this change doesn't break the reference
        this.check(this.uriPrefix, instanceUrl);

        this._instanceUrl = instanceUrl;
    }

    private check(uriPrefix: String, instanceUrl: String): void {
        // TODO: Add some sort of check for a SynBioHub instance. 
    }
}

export {
    SynBioHub
};