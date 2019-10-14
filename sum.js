const fs = require('fs');
const path = require('path');



const readDirSync = (base) => {
  let sum = 0;
  const files = fs.readdirSync(base);

  for(let item of files){
    let localBase = path.join(base, item);
    let state = fs.statSync(localBase);
    if (state.isDirectory()) {
      sum = sum + readDirSync(localBase);
    } else {
      const str = fs.readFileSync(localBase, {encoding: 'utf8'})
      console.log('str',str,localBase)
      let result = parseInt(str || 0);
      sum = sum + result;
    }
  }
  return sum;
};

// const resultSum = readDirSync('C:\\Users\\User\\Desktop\\Работа\\read_files\\Summa cifr');
//
// console.log('resultSum =',resultSum);

// function readSumFile(localBase){
//   const str = fs.readFileSync(localBase, {encoding: 'utf8'});
//   let addSum = parseInt(str || 0);
//   return Promise.resolve(addSum)
// }



// function readDirAsync(directory) {
//   return new Promise(function(resolve, reject) {
//     fs.readdir(directory, function(err, data) {
//       if (err) reject(err);
//       else {
//         // console.log("readDirAsync", data);
//         resolve(data);
//       }
//     });
//   });
// }
// function readDirAsync(directory) {
//   return fs.promises.readdir(directory)   //одно и тоже, что и выше
// }



// function readFileAsync(directory) {
//   return new Promise(function(resolve, reject) {
//     fs.readFile(directory, {encoding: 'utf8'}, function(err, data) {
//       if (err) reject(err);
//       else {
//         // console.log("readFileAsync", data);
//         resolve(data);
//       }
//     });
//   });
// }
// function readFileAsync(directory) {
//   return fs.promises.readFile(directory)   //одно и тоже, что и выше
// }

// function statAsync(directory) {
//   return new Promise(function(resolve, reject) {
//     fs.stat(directory, function(err, data) {
//       if (err) reject(err);
//       else {
//         // console.log("statAsync", data.isDirectory());
//         resolve(data);
//       }
//     });
//   });
// }
// function statAsync(directory) {
//   return fs.promises.stat(directory)   //одно и тоже, что и выше
// }


function readSumFileASync(localBase) {
  return new Promise(function(resolve, reject) {
    fs.promises.readFile(localBase).then(result => {
      let addSum = parseInt(result || 0);
      return resolve(addSum)
    });
    // reject(readFileAsync(localBase));
  });
}

function countNumbers (directory) {
  return  fs.promises.readdir(directory)    //читаем текущую папку
    .then(subFolders => {
      const promArr = subFolders.map(item => {  //массив
        let localBase = path.join(directory, item); //новое имя папки/файла
        return fs.promises.stat(localBase).then(state => {   //получаем свойства
          if (state.isDirectory()) {
            return countNumbers(localBase)    //рекурсия
          } else {
            return readSumFileASync(localBase)      //если не папка, то считываем файл
          }
        })
      });
      return Promise.all(promArr)   //возвращаем массив промиссов
    })
    .then(results => {
      let sum = 0;
      results.forEach(addSum => sum += addSum);   //суммируем все
      return sum
    })
}

countNumbers ("C:\\Users\\User\\Desktop\\Работа\\read_files\\Summa cifr").then(result => {
  console.log('Результат',result)
})

// const readDirSync = (base) => {
//   let sum = 0;
//   const files = fs.readdirSync(base);
//
//   for(let item of files) {
//     let localBase = path.join(base, item);
//     let state = fs.statSync(localBase);
//     if (state.isDirectory()) {
//       sum = sum + readDirSync(localBase);
//     } else {
//       const str = fs.readFileSync(localBase, {encoding: 'utf8'})
//       console.log('str',str,localBase)
//       let result = parseInt(str || 0);
//       sum = sum + result;
//     }
//   }
//   return sum;
// };