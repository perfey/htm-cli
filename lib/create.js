const inquirer = require('inquirer')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')

module.exports = option => {
  var config = _.assign({
    name: null,
    title: '',
    description: '',
    category: '',
    author: ''
  }, option)
  const rtx = process.env.COMBY_RTX || 'someone(某人)'
  const rtx_en = rtx.split('(')[0]
  const folderName = path.basename(process.cwd())
  var promps = []
  //组件库名
  if(!config.name) {
    promps.push({
      type: 'input',
      name: 'name',
      default: folderName,
      message: '请输入组件库英文名',
      validate: function (input){
        if(!input) {
          return '不能为空'
        }
        return true
      }
    })
  }
  //组件库中文名
  if(!config.title) {
    promps.push({
      type: 'input',
      name: 'title',
      message: '请输入组件库中文名',
      validate: function (input){
        if(!input) {
          return '不能为空'
        }
        return true
      }
    })
  }
  //组件库描述
  if(!config.description) {
    promps.push({
      type: 'input',
      name: 'description',
      default: '请填写组件库描述',
      message: '请输入组件库描述'
    })
  }
  //组件库类别
  if(!config.category) {
    promps.push({
      type: 'list',
      name: 'category',
      message: '请选择组件类别',
      choices: [
        {
          name: 'mobile',
          value: 'mobile'
        },
        {
          name: 'pc',
          value: 'pc'
        },
        {
          name: 'all',
          value: 'all'
        }
      ]
    })
  }
  //开发者
  if(!config.author) {
    promps.push({
      type: 'input',
      name: 'author',
      default: rtx_en,
      message: '请输入作者名称',
      validate: function (input){
        if(!input) {
          return '不能为空'
        }
        return true
      }
    })
  }
  inquirer.prompt(promps).then(function (answer) {
    config = _.assign(config, answer)
    // console.log('config:', config)
    var baseConfig = {
      libraryPath: process.cwd().replace(/\\/g, '/')
    }
    copyDir(path.resolve(__dirname, '../tpl/library'), baseConfig.libraryPath)
    //处理特殊文件
    let packageJson = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/package.json'))),
      readmeMd = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/README.md'))),
      themePackageJson = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/theme/package.json'))),
      themeReadmeMd = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/theme/README.md'))),
      libraryMd = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/index.md'))),
      bsCommonConfigJs = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/demoSite/bisheng.common.config.js'))),
      bsConfigJs = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/demoSite/bisheng.config.js'))),
      bsIndexJs = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/demoSite/src/index.js'))),
      bsNotFoundJsx = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/demoSite/src/template/NotFound.jsx'))),
      bsIndexJsx = String(fs.readFileSync(path.resolve(__dirname, '../tpl/library/demoSite/src/template/index.jsx')))
    try {
      packageJson = packageJson.replace(/__name__/g, config.name).replace(/__author__/, config.author)
      fs.writeFileSync(baseConfig.libraryPath+'/package.json', packageJson)
    } catch(e) {
      console.error('Error package.json: ' + e)
      return
    }
    try {
      readmeMd = readmeMd.replace(/__name__/g, config.name)
      fs.writeFileSync(baseConfig.libraryPath+'/README.md', readmeMd)
    } catch(e) {
      console.error('Error README.md: ' + e)
      return
    }
    try {
      themePackageJson = themePackageJson.replace(/__name__/g, config.name).replace(/__author__/, config.author)
      fs.writeFileSync(baseConfig.libraryPath+'/theme/package.json', themePackageJson)
    } catch(e) {
      console.error('Error /theme/package.json: ' + e)
      return
    }
    try {
      themeReadmeMd = themeReadmeMd.replace(/__name__/g, config.name)
      fs.writeFileSync(baseConfig.libraryPath+'/theme/README.md', themeReadmeMd)
    } catch(e) {
      console.error('Error /theme/README.md: ' + e)
      return
    }
    try {
      libraryMd = libraryMd.replace(/__title__/, config.title).replace(/__description__/, config.description).replace(/__category__/, config.category)
      fs.writeFileSync(baseConfig.libraryPath+'/index.md', libraryMd)
    } catch(e) {
      console.error('Error index.md: ' + e)
      return
    }
    try {
      bsCommonConfigJs = bsCommonConfigJs.replace(/__name__/, config.name)
      fs.writeFileSync(baseConfig.libraryPath+'/demoSite/bisheng.common.config.js', bsCommonConfigJs)
    } catch(e) {
      console.error('Error demoSite/bisheng.common.config.js: ' + e)
      return
    }
    try {
      bsConfigJs = bsConfigJs.replace(/__name__/, config.name)
      fs.writeFileSync(baseConfig.libraryPath+'/demoSite/bisheng.config.js', bsConfigJs)
    } catch(e) {
      console.error('Error demoSite/bisheng.config.js: ' + e)
      return
    }
    try {
      bsIndexJs = bsIndexJs.replace(/__name__/, config.name)
      fs.writeFileSync(baseConfig.libraryPath+'/demoSite/src/index.js', bsIndexJs)
    } catch(e) {
      console.error('Error demoSite/src/index.js: ' + e)
      return
    }
    try {
      bsNotFoundJsx = bsNotFoundJsx.replace(/__name__/, config.name)
      fs.writeFileSync(baseConfig.libraryPath+'/demoSite/src/template/NotFound.jsx', bsNotFoundJsx)
    } catch(e) {
      console.error('Error demoSite/src/template/NotFound.jsx: ' + e)
      return
    }
    try {
      bsIndexJsx = bsIndexJsx.replace(/__title__/, config.title)
      fs.writeFileSync(baseConfig.libraryPath+'/demoSite/src/template/index.jsx', bsIndexJsx)
    } catch(e) {
      console.error('Error demoSite/src/template/index.jsx: ' + e)
      return
    }
    console.info('组件库初始化完毕')
  })
}
