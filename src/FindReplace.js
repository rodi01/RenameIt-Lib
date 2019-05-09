/* eslint-disable class-methods-use-this */
/**
 * @Author: Rodrigo Soares <rodrigo>
 * @Date:   2017-11-17T17:26:39-08:00
 * @Project: Rename It
 * @Last modified by:   rodrigo
 * @Last modified time: 2017-12-02T21:22:41-08:00
 */

class FindReplace {
  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") // eslint-disable-line
  }

  layer(options) {
    const reg = options.caseSensitive
      ? new RegExp(this.escapeRegExp(options.findText), "g")
      : new RegExp(this.escapeRegExp(options.findText), "gi")
    return options.layerName.replace(reg, options.replaceWith)
  }

  match(options) {
    if (options.findText.length <= 0) return false
    let str = String(options.findText)
    let { layerName } = options
    if (!options.caseSensitive) {
      str = str.toLowerCase()
      layerName = layerName.toLowerCase()
    }

    return layerName.includes(str)
  }
}

export default FindReplace
