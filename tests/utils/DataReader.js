const xlsx = require('xlsx');

class DataReader {

    static async data(filePath, sheetName) {
        const mydata = [];

        const workbook = xlsx.readFile(filePath);

        const sheet = workbook.Sheets[sheetName];

        const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        for (const row of jsonData) {
            const currentHash = {};

            for (const key in row) {
                currentHash[key] = String(row[key]);
            }

            mydata.push(currentHash);
        }

        return mydata;
    }
}

module.exports = DataReader;