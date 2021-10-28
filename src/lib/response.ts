export default class FPResponse {
    headers: Headers;
    private _body: string = "";
    status: number = 0;

    constructor(){
        this.headers = new Headers();
    }

    send(body: string){
        this._body = body;
    }
    
    // For better express support
    end(body: string){
        this.send(body);
    }

    writeHead(statusCode: number, headers: {}) {
        this.status = statusCode;

        Object.keys(headers).map(k => {
            this.headers.set(k, headers[k]);
        })

    }

    get body(){
        return this._body;
    }

    // Set sensible values if things are not set, such as 200 status code if the user doesnt set a status code.
    setDefaults(){
        if(this.status == 0) {
            if(this.body.length == 0){
                this.status = 404;
                this._body = "Not Found"
            }else{
                this.status = 200;
            }
        }
    }
}