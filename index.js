const program = require('commander')
const json = require('./package.json')
const create = require('./lib/create')

program
  .version(json.version)
  .description('常规html项目脚手架')
  .option('-v', '版本号')
  
if (!process.argv.slice(2).length) {
  program.outputHelp();
} else if (process.argv.length === 3 && process.argv[2] === '-v') {
  console.info('version', json.version)
}

// 创建项目
program
  .command('create')
  .alias('c')
  .description('初始化项目')
  .option('-n, --name [name]', '项目英文名称')
  .action(option => {
    create(option)
  })
  .on('--help', function() {
    console.info('  Examples:')
    console.info('')
    console.info('$ htm create --name [name]')
    console.info('$ htm c -n [name]')
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
