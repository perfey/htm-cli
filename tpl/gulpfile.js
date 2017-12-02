const gulp = require('gulp')
const postcss = require('gulp-postcss')
const sprites = require('postcss-sprites')
const base64 = require('gulp-base64')
const del = require('del')
const fs = require('fs')
const path = require('path')
const colors = require('colors')

const config = {
  sprite: {
    padding: 4,
    ratio: {{screenRatio}}
  }
}

gulp.task('css_img', (done) => {
  const opts = {
    stylesheetPath: './publish/css',
    spritePath: './publish/img/',
    spritesmith: { padding: config.sprite.padding },
    retina: (config.sprite.ratio > 1) ? true : false,
    hooks: false,
    filterBy: (image) => {
      if (image.url.indexOf('/slice/') === -1 || image.url.indexOf('/slice/inline/') > -1) {
        return Promise.reject()
      }
      return Promise.resolve()
    },
    groupBy: (image) => {
      return spritesGroupBy(image)
    }
  }

  const spritesGroupBy = (image) => {
    let groupName = 'x'
    const groups = image.url.split('/slice/')
    const arrName = groups[1].split('/')
    const arrNameLen = arrName.length
    if (arrNameLen > 1) {
      groupName = arrName[0]
    }
    image.retina = (config.sprite.ratio > 1) ? true : false
    image.ratio = config.sprite.ratio
    return Promise.resolve(groupName)
  }

  const stream = gulp.src('./css/*.css')
    .pipe(postcss([sprites(opts)]))
    .pipe(base64({
      extensions: [/\/slice\/inline\/.+\.png$/i, /\/slice\/inline\/.+\.svg$/i, /\/slice\/inline\/.+\.jpe?g$/i],
      deleteAfterEncoding: false,
      maxImageSize: 1000*1024,
      debug: false
    }))
    .pipe(gulp.dest('./publish/css'))
  return stream
})

gulp.task('cp_html', (done) => {
  return gulp.src('./html/*.html')
    .pipe(gulp.dest('./publish/html'))
})

gulp.task('cp_img', ['css_img'], (done) => {
  gulp.src(['./publish/img/**/sprite.*.png'])
    .pipe(gulp.dest('./generate_sprite/new/'))
  return gulp.src('./img/**')
    .pipe(gulp.dest('./publish/img'))
})

gulp.task('cp_js', (done) => {
  return gulp.src(['./js/*.js'])
    .pipe(gulp.dest('./publish/js'))
})

gulp.task('publish', ['cp_html', 'cp_img', 'cp_js'], () => {
  if (fsExistsSync('./generate_sprite/new')) {
    funMkdirSync('./generate_sprite/min')
    if (!fsExistsSync('./generate_sprite/bak')) {
      fs.renameSync('./generate_sprite/new/', './generate_sprite/bak')
      const files = getAllFiles('./generate_sprite/bak')
      console.warn(colors.yellow('警告! 以下图片需要手动压缩'))
      files.forEach((file) => {
        console.info(colors.yellow(file.replace('./generate_sprite/bak/', './publish/img/')))
      })
      console.warn(colors.yellow('把手动压缩后的文件放置到./generate_sprite/min/, 再运行publish即可'))
    } else {
      const files = getAllFiles('./generate_sprite/bak')
      const minFiles = getAllFiles('./generate_sprite/min')
      const newFiles = getAllFiles('./generate_sprite/new')
      const needMin = []
      const filesInfo = []
      files.forEach((file) => {
        const info = fs.statSync(file)
        info.name = path.basename(file)
        info.path = file
        filesInfo.push(info)
      })
      newFiles.forEach((file) => {
        let hasFile = false
        let sameSize = false
        const info = fs.statSync(file)
        const changeNewPath = file.replace('/generate_sprite/new/', '/generate_sprite/bak/')
        for (let i in filesInfo) {
          if (changeNewPath === filesInfo[i].path) {
            hasFile = true
            if (info.size === filesInfo[i].size) {
              sameSize = true
            }
            break
          }
        }
        let hasMinFile = false
        if (hasFile) {
          const extName = path.extname(file)
          const preName = file.replace(extName, '')
          const name1 = file.replace('/generate_sprite/new/', '/generate_sprite/min/')
          const name2 = `${preName}.min${extName}`.replace('/generate_sprite/new/', '/generate_sprite/min/')
          const name3 = `${preName}-min${extName}`.replace('/generate_sprite/new/', '/generate_sprite/min/')
          if (sameSize) {
            for (let j in minFiles) {
              const minPath = minFiles[j]
              if (minPath === name1) {
                fs.writeFileSync(file.replace('/generate_sprite/new/', '/publish/img/'), fs.readFileSync(name1))
                hasMinFile = true
                break
              } else if (minPath === name2) {
                fs.writeFileSync(file.replace('/generate_sprite/new/', '/publish/img/'), fs.readFileSync(name2))
                hasMinFile = true
                break
              } else if (minPath === name3) {
                fs.writeFileSync(file.replace('/generate_sprite/new/', '/publish/img/'), fs.readFileSync(name3))
                hasMinFile = true
                break
              }
            }
          } else {
            fs.writeFileSync(file.replace('/generate_sprite/new/', '/generate_sprite/bak/'), fs.readFileSync(file))
            del.sync([
              name1,
              name2,
              name3
            ])
          }
        } else {
          fs.writeFileSync(file.replace('/generate_sprite/new/', '/generate_sprite/bak/'), fs.readFileSync(file))
        }
        if (!hasMinFile) {
          needMin.push(file)
        }
      })
      if (needMin.length > 0) {
        console.warn(colors.yellow('警告! 以下图片需要手动压缩'))
        needMin.forEach((file) => {
          console.info(colors.yellow(file.replace('./generate_sprite/new/', './publish/img/')))
        })
        console.warn(colors.yellow('把手动压缩后的文件放置到./generate_sprite/min/, 再运行publish即可'))
      }
    }
  }
  del.sync(['./generate_sprite/new'])
})

// 判断文件/夹是否存在
function fsExistsSync(path) {
  try{
    fs.accessSync(path, fs.F_OK)
  }catch(e){
    return false
  }
  return true
}

// 获取文件夹下面的所有的文件(包括子文件夹)
function getAllFiles(dir) {
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

// 新建路径  第二个参数可以忽略  
function funMkdirSync(dirpath,dirname){
  // 判断是否是第一次调用  
  if(typeof dirname === "undefined"){
    if(fsExistsSync(dirpath)){
      return
    }else{
      funMkdirSync(dirpath,path.dirname(dirpath))
    }
  }else{
    // 判断第二个参数是否正常，避免调用时传入错误参数
    if(dirname !== path.dirname(dirpath)){
      funMkdirSync(dirpath)
      return
    }
    if(fsExistsSync(dirname)){
      fs.mkdirSync(dirpath)
    }else{
      funMkdirSync(dirname,path.dirname(dirname))
      fs.mkdirSync(dirpath)
    }
  }
}
