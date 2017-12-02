const child_process = require('child_process')
const colors = require('colors')

const sassProcess = child_process.exec('node-sass ./scss -o ./css -w')

sassProcess.stdout.on('data', function (data) {
  console.info('sass stdout: ', String(data))
})
sassProcess.stderr.on('data', function (data) {
  const strData = String(data)
  if (isJSON(strData)) {
    console.error(colors.red(String(data)))
  } else {
    console.info(colors.green(String(data)))
  }
})
sassProcess.on('close', function (code) {
  console.info('code: ', code)
})

function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)
      if (str.indexOf('{') > -1){
        return true
      } else {
        return false
      }
    } catch(e) {
      return false
    }
  }
  return false
}
