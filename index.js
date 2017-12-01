const program = require('commander')
const json = require('./package.json')
const init = require('./lib/init')
const component = require('./lib/component')
const check = require('./lib/check')
const { build } = require('./lib/build')
const view = require('./lib/view')
const upload = require('./lib/upload')


//组件说明
program
  .version(json.version)
  .description('通用能力平台构建工具')
  .option('-v', '版本号')
  
if (!process.argv.slice(2).length) {
  program.outputHelp();
} else if (process.argv.length === 3 && process.argv[2] === '-v') {
  console.info('version', json.version)
}

//初始化组件库
program
  .command('init')
  .alias('i')
  .description('初始化组件库')
  .option('-n, --name [name]', '组件库名称')
  .action(option => {
    init(option)
  })
  .on('--help', function() {
    console.info('  Examples:')
    console.info('')
    console.info('$ comby init --name [libraryName]')
    console.info('$ comby i -n [libraryName]')
  })

//新建组件
program
  .command('component')
  .alias('c')
  .description('创建新的组件')
  .option('-n, --name [name]', '组件名')
  .action(option => {
    component(option)
  })
  .on('--help', function() {
    console.info('  Examples:')
    console.info('')
    console.info('$ comby component --name [componentName]')
    console.info('$ comby c -n [componentName]')
  })

//校验
program
  .command('check')
  .alias('ch')
  .description('校验组件')
  .option('-n, --name [name]', '组件名')
  .option('-p, --precommit [precommit]', '是否为precommit检查，默认false')
  .option('-j, --js [js]', '只校验js，默认false')
  .option('-o, --old [old]', '是否为旧的目录结构，默认false')
  .action(option => {
    check(option)
  })
  .on('--help', function() {
    console.info('  Examples:')
    console.info('')
    console.info('$ comby check --name [componentName]')
    console.info('$ comby ch -n [componentName]')
  })

//构建组件库
program
  .command('build')
  .alias('b')
  .description('构建组件库')
  .option('-p, --path [path]', '路径，默认当前文件夹')
  .option('-b, --babel [babel]', '是否使用工具内提供的babel配置和依赖，默认false')
  .option('-r, --release [release]', 'npm/tnpm包新的版本号')
  .option('-t, --tool [tool]', '发布工具，npm/tnpm 默认tnpm')
  .option('-c, --css [css]', '只打包主题')
  .option('-o, --old [old]', '是否为旧的目录结构，默认false')
  .action(option => {
    build(option)
  })
  .on('--help', function() {
    console.info('  Examples:')
    console.info('')
    console.info('$ comby build --plat [tnpm/npm]')
    console.info('$ comby b -p [tnpm/npm]')
  })

program.parse(process.argv)
