/**
 * @Author: Rodrigo Soares <rodrigo>
 * @Date:   2017-11-17T17:23:24-08:00
 * @Project: Rename It
 * @Last modified time: 2017-12-02T10:17:35-08:00
 */

import changeCase from "change-case"
import toTitleCase from "titlecase"

class Rename {
  constructor({ allowTextCases = true, allowPageName = true, allowParent = true } = {}) {
    this.allowTextCases = allowTextCases
    this.allowPageName = allowPageName
    this.allowParent = allowParent
  }

  // eslint-disable-next-line class-methods-use-this
  paddy(n, p, c) {
    const padChar = typeof c !== "undefined" ? c : "0"
    const pad = new Array(1 + p).join(padChar)
    return (pad + n).slice(-pad.length)
  }

  currentLayer(newLayerName, layerName) {
    let name = newLayerName

    if (this.allowTextCases) {
      // UpperCase
      name = name.replace(/%\*u%/gi, changeCase.upperCase(layerName))
      // LowerCase
      name = name.replace(/%\*l%/gi, changeCase.lowerCase(layerName))
      // Title Case
      name = name.replace(/%\*t%/gi, toTitleCase(layerName))
      // UpperCase First
      name = name.replace(/%\*uf%/gi, changeCase.upperCaseFirst(layerName))
      // Camel Case
      name = name.replace(/%\*c%/gi, changeCase.camelCase(layerName))
      // Param Case
      name = name.replace(/%\*pc%/gi, changeCase.paramCase(layerName))
    }
    // Layername
    name = name.replace(/%\*/g, layerName)
    return String(name)
  }

  // eslint-disable-next-line class-methods-use-this
  layer(options) {
    let newLayerName = options.inputName

    // Interator
    const nInterators = newLayerName.match(/%N+/gi)
    const aInterators = newLayerName.match(/(?!%ar%)%A/gi)
    const reverseAInterators = newLayerName.match(/%ar%/gi)
    // eslint-disable-next-line no-underscore-dangle
    const _this = this

    // Number Interator
    if (nInterators != null) {
      /* eslint-disable */
      // Replace Number
      function replaceNumber(match) {
        let nnSize = match.length - 1
        const letter = match.charAt(1)
        let num = letter == "N" ? options.currIdx : options.selectionCount - options.currIdx - 1
        num += options.startsFrom
        // Check weather or not the number is bigger than the nnSizes (works up to 9999)
        if (num > 999 && (nnSize === 1 || nnSize === 2 || nnSize === 3)) nnSize = 4
        else if (num > 99 && (nnSize === 1 || nnSize === 2)) nnSize = 3
        else if (num > 9 && nnSize == 1) nnSize = 2
        return _this.paddy(num, nnSize)
      }

      newLayerName = newLayerName.replace(/%n+/gi, replaceNumber)
    }
    // Alpha Interator
    const alphaStr = "abcdefghijklmnopqrstuvwxyz"
    const alphaArr = alphaStr.split("")
    const totalAlpha = alphaArr.length
    // Replace Alpha
    function replaceAlpha(match) {
      const letter = match.charAt(1)
      const current =
        match === "%ar%" ? options.selectionCount - options.currIdx - 1 : options.currIdx
      let alpha = alphaArr[current % totalAlpha]
      if (current >= totalAlpha) {
        const flIdx = Math.floor(current / totalAlpha)
        alpha = `${alphaArr[flIdx - 1]}${alpha}`
      }
      return letter === "A" ? alpha.toUpperCase() : alpha
    }
    // Reverse Alpha
    if (reverseAInterators != null) {
      newLayerName = newLayerName.replace(/%ar%/gi, replaceAlpha)
    }
    if (aInterators != null) {
      newLayerName = newLayerName.replace(/%a/gi, replaceAlpha)
    }

    // Replace asterisks
    newLayerName = _this.currentLayer(newLayerName, options.layerName)

    // Add Width and/or height
    newLayerName = newLayerName.replace(/%w/gi, options.width)
    newLayerName = newLayerName.replace(/%h/gi, options.height)

    // Page Name
    if (this.allowPageName) {
      newLayerName = newLayerName.replace(/%p/gi, options.pageName)
    }

    // Parent Name
    if (this.allowParent) {
      newLayerName = newLayerName.replace(/%o/gi, options.parentName)
    }

    // Return new name
    return newLayerName
  }
}

export default Rename
