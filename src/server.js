/**
* Server handles a network connection to a Horizon instance and exposes an
* interface for requests to that instance.
*/
export class Server {
    constructor(config={}) {
        this.hostname = config.hostname || "localhost";
        this.port = config.port || 3000;
    }

    /**
    * Submits a transaction to the network.
    * @param {Transaction} transaction - The transaction to submit.
    */
    submitTransaction(transaction) {
        var self = this;
        return new Promise(function (resolve, reject) {
            request
                .post("http://" + self.hostname + ":" + self.port + '/transactions')
                .type('json')
                .send({
                    tx: transaction.toEnvelope().toXDR().toString("hex")
                })
                .end(function(err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.stringify(res.body));
                    }
                });
        });
    }


    /**
    * Loads account details to the given account object.
    * @param {Account} account - The account to load. Will modify this object with
    */
    loadAccount(account) {
        var self = this;
        return new Promise(function (resolve, reject) {
            request
                .get("http://" + self.hostname + ":" + self.port + '/accounts/' + account.address)
                .end(function(err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        account.sequence = res.body.sequence;
                        account.balances = res.body.balances;
                        resolve();
                    }
                });
        });
    }
}