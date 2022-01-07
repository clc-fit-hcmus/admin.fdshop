const Person = require('../models/persons');

function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    return str;
}

function generateAccount(name, count = 0) {
    const usgName = nonAccentVietnamese(name);
    const strArray = usgName.split(" ");

    var stringBuilder = [];

    const maxRange = usgName.length - strArray[strArray.length - 1].length - 2 * (strArray.length - 1);

    if (count >= maxRange) {
          for (const item of strArray) {
              stringBuilder.push(item);
          }      

          if (count - maxRange != 0) {
              stringBuilder.push((count - maxRange).toString());
          }
    } else {
        let valPosition = [];

        for (let i = 0; i < strArray.length - 1; i++) {
            valPosition[i] = 1;
        }

        let forLoop = count;
        let index = 0;

        while (forLoop > 0) {
            if (strArray[index].length > valPosition[index]) {
                valPosition[index] += 1;
                forLoop--;
            }

            index++;
            if (index == strArray.length - 1) {
                index = 0;
            }
        }

        for (let i = 0; i < strArray.length - 1; i++) {
            for (let j = 0; j < valPosition[i]; j++) {
                stringBuilder.push(strArray[i][j])
            }
        }

        stringBuilder.push(strArray[strArray.length - 1]);
    }

    return stringBuilder.join("");
}

const count = (filter = {}) => Person.countDocuments(filter).exec();

async function getAccount(Name, role) {
    let index = 0;
    while (true) {
        let username = generateAccount(Name, index);
        console.log(username);
        const num = await count({ "login.username": username, "login.role": role });
        if (num == 0) {
            return username;
        }
        index++;
    }
}

module.exports = {
    getAccount
}