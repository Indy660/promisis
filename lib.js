//Подключение модулей

const fs = require('fs');
const path = require('path');
const async = require("async");





// function arrayFilesFuncAsync(way) {
//     let final=[];
//     let result = fs.readdir(way, function(err, items) {
//         console.log(items);
//     });
//     return result
// }

// function arrayFilesFuncAsync(way) {
//     let final=[];
//     let result = fs.readdir(way, function(err, items) {
//         console.log(items);
//     });
//     return result
// }

// function arrayFilesFuncAsync(way) {
//     return new Promise ((resolve, reject) => {
//         let result = fs.readdir(way);
//         return reject(result);
//     }
//     return resolve();
// })
// }


// console.log(arrayFilesFuncAsync("C:\\Users\\User\\Desktop\\Работа\\read_files"))
//////////////////////////////////////////////////////////////////////////////
function arrayFilesFunc(way) {
    let final=[];
    let result = fs.readdirSync(way);
    for (let i = 0; i < result.length; i++) {
        final.push(path.join(way, result[i]))
    }
    return final
}

function thisIsFile(way) {
    return fs.statSync(way).isFile()
}

function whatInThisFolder(way) {
    let unSorted = arrayFilesFunc(way);
    let arrayFolders = [];
    let arrayFiles = [];
    for (let i = 0; i<unSorted.length; i++) {
        if (thisIsFile(unSorted[i]) === false) {
            arrayFolders.push(unSorted[i])
        } else {
            arrayFiles.push(unSorted[i])
        }
    }
    return {arrayFolders, arrayFiles}
}


function readFolderAsync (way) {
    return new Promise((resolve, reject) => {
        fs.readdir(way, (error, files) => {
            error ? reject(error) : resolve(files);
        });
    });
}

function fullNamesInThisFolder (way) {
    return readFolderAsync(way).then(
         function (result) {
             return result.map(function(elem) {
                    return path.join(way, elem)
                }, 0);
        }
    )
    //     .then(
    // result2 => console.log(result2)
    // )
}
// fullNamesInThisFolder("C:\\Users\\User\\Desktop\\Работа\\read_files")


// function thisIsFileAsync(way) {
//     return fullNamesInThisFolder(way).then(
//         result => fs.stat(result, function (err, stats) {
//             if (err) {
//                 console.log(err);
//                 return; // exit here since stats will be undefined
//             }
//             return stats.isFile()
//             // if (stats.isFile()) { }}).isFile()
//         }).then(
//             result2 => console.log("Файл ли " +result2)
//         )
//     )
// }
// thisIsFileAsync("C:\\Users\\User\\Desktop\\Работа\\read_files")

function thisIsFileAsync(way) {
    return fs.statSync(way).isFile()
}
 // console.log("Файл ли " +thisIsFileAsync("C:\\Users\\User\\Desktop\\Работа\\read_files\\package.json"))



function whatInThisFolderAsync (way) {
    return fullNamesInThisFolder(way).then(
        function (unSorted) {
            let arrayFolders = [];
            let arrayFiles = unSorted.filter(function (elem) {
                if (thisIsFileAsync(elem) === true) {
                    return true;
                } else {
                    arrayFolders.push(elem);
                }
            });
            return {arrayFiles, arrayFolders}
        })
    //     .then(
    //     result2 => console.log(result2)
    // )
}
 // whatInThisFolderAsync("C:\\Users\\User\\Desktop\\Работа\\read_files")



function promisify(func, ...args) {
    return new Promise((resolve, reject) => {
        func(...args, (error, result) => {
            if (error) {
                reject (error);
            } else {
                resolve (result);
            }
        })
    });
}

function seeDateAsync(array) {
    return array.then(result => {
        return Promise.all(result.map(function (elem) {
            return promisify(fs.stat, elem).then(result => {
                console.log("Дата " + result.birthtime);
                return result.birthtime
            })
        }))
    })
}

function test_readFolder(folderPath) {
    const promReaddir = new Promise((resolve, reject) => {
        fs.readdir(folderPath, (error, files) => {
            error ? reject(error) : resolve(files);
        });
    });
    const promNext = promReaddir.then(list => {
        console.log(list);
        return list
    });
    return seeDateAsync(promNext).then(result => {
        console.log("Конец");
        console.log(result)
    })
}

// return promNext.then(result => {
//     return Promise.all(result.map(function (elem) {
//         return promisify(fs.stat, elem).then(result => {
//             console.log("Дата " + result.birthtime);
//             return result.birthtime
//         })
//     }))
// })
// test_readFolder('C:\\Users\\User\\Desktop\\Работа\\read_files')




function countAllFolders (way) {
    function twoArray(readyFolders, notEmptyFolders) {
        if (notEmptyFolders.length > 0) {
            let nextFolder = notEmptyFolders[0];   //Прочитываем файлы из следующей директории
            // console.log("Путь " + nextFolder);
            let newFolders =  whatInThisFolder(nextFolder).arrayFolders;  //массив следующих папок
            for (let i = 0; i < newFolders.length; i++) {
                readyFolders.push(newFolders[i]);
                notEmptyFolders.shift();                         //удаление первого элемента
                notEmptyFolders.unshift(newFolders[i]);
                twoArray(readyFolders, notEmptyFolders)
            }
        }
        return readyFolders
    }
    return twoArray([way], [way])
}
 // console.log(countAllFolders("C:\\Users\\User\\Desktop\\Summa cifr"));



function countAllFoldersAsync (way) {
    function twoArrayAsync(readyFolders, notEmptyFolders) {
        if (notEmptyFolders.length > 0) {
            let nextFolder = notEmptyFolders[0];   //Прочитываем файлы из следующей директории
            console.log("Путь " + nextFolder);
            const promArr = whatInThisFolderAsync(nextFolder).then(result => {
                // console.log(result.arrayFolders);
                return result.arrayFolders
            })
            return Promise.all(promArr).then(newFolders => {
                for (let i = 0; i < newFolders.length; i++) {
                    readyFolders.push(newFolders[i]);
                    notEmptyFolders.shift();                         //удаление первого элемента
                    notEmptyFolders.unshift(newFolders[i]);
                    twoArrayAsync(readyFolders, notEmptyFolders)
                }
            })
            }
        return readyFolders
        }
    return twoArrayAsync([way], [way])
}




countAllFoldersAsync ("C:\\Users\\User\\Desktop\\Работа\\read_files\\Summa cifr")

    // .then(result => {
    //     console.log("Final" + result)
    // })


function showFiles (way) {
    let folders = countAllFolders (way);
    let files = [];
    for (let i = 0; i < folders.length; i++) {              //пути
        let preFiles = whatInThisFolder(folders[i]).arrayFiles;
        for (let j = 0; j < preFiles.length; j++) {       //файлы
                files.push(preFiles[j])
            }
        }
    return files
}

function countNumbersInFiles(way) {
    let files = showFiles (way);
    let summ = 0;
    for (let i = 0; i < files.length; i++) {
        summ += Number(fs.readFileSync( files[i], "utf8"));
    }
    return summ
}
 //
 // console.log(countNumbersInFiles("C:\\Users\\User\\Desktop\\Работа\\read_files\\Summa cifr"))



// module.exports = countNumbersInFiles;






// function sumSim(a,b){
//     const result = a+b;
//     return result;
// }
//
// const sum = sumSim(1,6)
//
//
//
// function sumSim(a,b,callback){
//     const result = a+b;
//     callback(result);
// }
//
// sumSim(1,6, function(sum){
//     console.log(sum)
// })
//
//
//
//
//
// sumSim(3,4).then(function(result){
//     console.log(result)
// })


