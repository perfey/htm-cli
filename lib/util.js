const fs = require('fs')
const path = require('path')

// 检测文件或者文件夹存在
function fsExistsSync(path) {
  try{
    fs.accessSync(path, fs.F_OK)
  }catch(e){
    return false
  }
  return true
}

// 新建文件夹 使用时第二个参数可以忽略  
function funMkdirSync(dirpath,dirname){
  //判断是否是第一次调用  
  if(typeof dirname === "undefined"){
    if(fsExistsSync(dirpath)){
      return;
    }else{
      funMkdirSync(dirpath,path.dirname(dirpath));
    }
  }else{
    //判断第二个参数是否正常，避免调用时传入错误参数
    if(dirname !== path.dirname(dirpath)){
      funMkdirSync(dirpath);
      return;
    }
    if(fsExistsSync(dirname)){
      fs.mkdirSync(dirpath)
    }else{
      funMkdirSync(dirname,path.dirname(dirname));
      fs.mkdirSync(dirpath);
    }
  }
}

/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src, dist) {
  // 目录不存在时创建目录
  if (!fsExistsSync(dist)) {
    fs.mkdirSync(dist);
  }
  _copy(src, dist);
}
function _copy(src, dist) {
  var paths = fs.readdirSync(src)
  paths.forEach(function(path) {
    var _src = src + '/' +path
    var _dist = dist + '/' +path
    var stat = fs.statSync(_src)
    // 判断是文件还是目录
    if(stat.isFile()) {
      if (path.indexOf('.DS_Store') !== 0) {
        fs.writeFileSync(_dist, fs.readFileSync(_src))
      }
    } else if(stat.isDirectory()) {
      // 当是目录时，递归复制
      copyDir(_src, _dist)
    }
  })
}

//获取文件夹下面的所有的文件(包括子文件夹)
function getAllFiles(dir, callback) {
  var filesArr = []
  ;(function funDir(dirpath) {
    var files = fs.readdirSync(dirpath)
    files.forEach(function(file) {
      var filePath = dirpath + '/' + file
      var info = fs.statSync(filePath)
      if (info.isDirectory()) {
        funDir(filePath)
      } else {
        filesArr.push(filePath)
      }
    })
  })(dir)
  return filesArr
}

module.exports = {fsExistsSync, funMkdirSync, copyDir, getAllFiles}
