const inquirer = require('inquirer')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const colors = require('colors')
const { copyDir, fsExistsSync, funMkdirSync } = require('./util')

module.exports = option => {
  let config = _.assign({
    name: null,
    screenRatio: null,
    author: null
  }, option)
  const promps = []
  if(!config.name) {
    promps.push({
      type: 'input',
      name: 'name',
      message: '请输入项目英文名',
      validate: function (input){
        if(!input) {
          return '不能为空'
        }
        return true
      }
    })
  }
  if(!config.screenRatio) {
    promps.push({
      type: 'input',
      name: 'screenRatio',
      default: 3,
      message: '请选择retina图片（设计稿）倍数',
      validate: function(input) {
        if(!input) {
          return '不能为空'
        }
        return true
      }
    })
  }
  if(!config.author) {
    promps.push({
      type: 'input',
      name: 'author',
      message: '请输入作者名称',
      validate: function(input) {
        if(!input) {
          return '不能为空'
        }
        return true
      }
    })
  }
  inquirer.prompt(promps).then(function(answer) {
    config = _.assign(config, answer)
    if (fsExistsSync(`./${config.name}`)) {
      console.warn(colors.red('Error: 项目已经存在，无法新建同名项目'))
      return
    }
    copyDir(path.resolve(__dirname, '../tpl'), `./${config.name}`)
    funMkdirSync(`./${config.name}/img`)
    funMkdirSync(`./${config.name}/slice`)
    let packageJson = String(fs.readFileSync(path.resolve(__dirname, '../tpl/package.json'))),
      gulpfileJs = String(fs.readFileSync(path.resolve(__dirname, '../tpl/gulpfile.js')))
    try {
      packageJson = packageJson.replace(/\{\{name\}\}/g, config.name).replace(/\{\{author\}\}/, config.author)
      fs.writeFileSync(`./${config.name}/package.json`, packageJson)
    } catch(e) {
      console.error(`Error package.json: ${e}`)
      return
    }
    try {
      gulpfileJs = gulpfileJs.replace(/\{\{screenRatio\}\}/, config.screenRatio)
      fs.writeFileSync(`./${config.name}/gulpfile.js`, gulpfileJs)
    } catch(e) {
      console.error(`Error gulpfile.js: ${e}`)
      return
    }
    console.info('项目初始化完毕')
  })
}
