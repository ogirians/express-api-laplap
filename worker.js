const { parentPort } = require('worker_threads');
//conect postgre
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://itki:soetomo_dr@10.1.1.68:5487/simpp-dev')


//untuk read/write file system
const fs = require('fs');

//untuk export excell
const json2xls = require('json2xls');


parentPort.on('message', (message) => {
  console.log(`Received message in worker: ${JSON.stringify(message)}`);

  // Perform some CPU-intensive task
  createXlsxFile().then((result) => {
      parentPort.postMessage(result);
  });
  // Send the result back to the main thread
});

function createXlsxFile() {
     return new Promise((resolve, reject) => {
        db.manyOrNone('select * from soapie_sql_v where tgl_pendaftaran >= $1 and tgl_pendaftaran < $2 limit 10000', ['2023-03-01 00:00:00', '2023-04-01 00:00:00'])
        .then((data) => {
            try {
                const jsonArray = data;
                const xls = json2xls(jsonArray);
                fs.writeFileSync('data.xlsx', xls, 'binary');
                resolve("berhasil konvert excell");
            } catch (error) {
                // Error handling code
            console.log('ERROR:', error)
            }
        })
        .catch((error) => {
            console.log('ERROR:', error)
        })
     });
}