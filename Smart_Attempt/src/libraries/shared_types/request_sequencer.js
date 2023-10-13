
class MyRequest {

    constructor(/**@type {string} */ address, data = {}, /**@type {function} */ success = () => {}, /**@type {function} */ error = () => {}) {
        /**@type {string} */
        this.address = address;
        /**@type {object} */
        this.data = data;
        /**@type {function} */ 
        this.success = success;
        /**@type {function} */ 
        this.error = error;
    }

    // TODO: Test if this fucking works
    attackToSuccess(/**@type {function} */ succ) {
        const oldSuccess = this.success;
        this.success = () => {
            oldSuccess(...arguments);
            succ(...arguments);
        }
    }

}

class RequestType {

    static GET = new RequestType((req) => {window.$.get(req.address, req.data, req.success).error(req.error);});
    //static HEAD = new RequestType((req) => {window.$.get(req.address, req.data, req.success).error(req.error);});
    static POST = new RequestType((req) => {window.$.post(req.address, req.data, req.success).error(req.error);});

    constructor(executeFunc = (/**@type {MyRequest} */ req) => {}) {
        /**@type {function} */
        this.executeFunc = executeFunc;
    }

    sendRequest(/**@type {MyRequest} */ req) {
        this.executeFunc(req);
    }

}

class RequestSequencer {

    constructor(/**@type {RequestType} */ type) {
        /**@type {RequestType} */
        this.type = type;
        /**@type {boolean} */
        this.ongoing = false;
        /**@type {number} */
        this.maxConcurrentConnections = 3;
        /**@type {number} */
        this.concurrentConnections = 0;
        /**@type {Array<MyRequest>} */
        this.queue = [];
    }

    addRequest(/**@type {MyRequest} */ req) {

    }


}