const program = require('commander')
const json = require('./package.json')
const create = require('./lib/create')

program
  .version(json.version)
  .description('常规html项目脚手架')
  .option('-v', '版本号')

if (!process.argv.slice(2).length) {
  program.outputHelp()
} else if (process.argv.length === 3 && process.argv[2] === '-v') {
  console.info('version', json.version)
}

// 创建项目
program
  .command('create')
  .alias('c')
  .description('初始化项目')
  .option('-n, --name [name]', '项目英文名称')
  .option('-t, --type [type]', '项目类型：html(默认) ejs')
  .action(option => {
    create(option)
  })
  .on('--help', function() {
    console.info('  Examples:')
    console.info('')
    console.info('$ htm create --name [name]')
    console.info('$ htm c -n [name]')
  })

program.parse(process.argv)
