/**
 * @Author: Rodrigo Soares <rodrigo>
 * @Date:   2017-11-17T17:23:24-08:00
 * @Project: Rename It
 * @Last modified time: 2017-12-02T10:17:35-08:00
 */

import * as changeCase from "change-case"
import toTitleCase from "titlecase"
import { upperCase } from "upper-case"
import { lowerCase } from "lower-case"
import { upperCaseFirst } from "upper-case-first"

/*eslint-disable */
// prettier-ignore
const uppercaseSC = "%\\*u%",
      lowerCaseSC = "%\\*l%",
      titleCase = "%\\*t%",
      upperFirstCase = "%\\*uf%",
      camelCase = "%\\*c%",
      paramCase = "%\\*pc%",
      numberSequence = "%N",
      alphaSequence = "%a",
      alphaReverse = "%ar%",
      width = "%w",
      height = "%h",
      page = "%p",
      parent = "%o",
      symbol = "%s",
      layerStyle = "%ls%",
      childLayer = "%ch%"

// prettier-ignore-end
/* eslint-enable */

class Rename {
  constructor({
    allowTextCases = true,
    allowPageName = true,
    allowParent = true,
    allowSymbol = true,
    allowLayerStyle = true,
    allowChildLayer = false,
  } = {}) {
    this.allowTextCases = allowTextCases
    this.allowPageName = allowPageName
    this.allowParent = allowParent
    this.allowSymbol = allowSymbol
    this.allowLayerStyle = allowLayerStyle
    this.allowChildLayer = allowChildLayer
  }

  // eslint-disable-next-line class-methods-use-this
  shortcut(s) {
    return new RegExp(s, "gi")
    // return `/${escapeStringRegexp(s)}/gi`
  }

  // eslint-disable-next-line class-methods-use-this
  paddy(n, p, c) {
    const padChar = typeof c !== "undefined" ? c : "0"
    const pad = new Array(1 + p).join(padChar)
    return (pad + n).slice(-pad.length)
  }

  // eslint-disable-next-line class-methods-use-this
  convertTitleCase(layerName) {
    const l = lowerCase(layerName)
    return toTitleCase(l)
  }

  currentLayer(newLayerName, layerName) {
    let name = newLayerName

    if (this.allowTextCases) {
      // UpperCase
      name = name.replace(this.shortcut(uppercaseSC), upperCase(layerName))
      // LowerCase
      name = name.replace(this.shortcut(lowerCaseSC), lowerCase(layerName))
      // Title Case
      name = name.replace(this.shortcut(titleCase), this.convertTitleCase(layerName))
      // UpperCase First
      name = name.replace(this.shortcut(upperFirstCase), upperCaseFirst(layerName))
      // Camel Case
      name = name.replace(this.shortcut(camelCase), changeCase.camelCase(layerName))
      // Param Case
      name = name.replace(this.shortcut(paramCase), changeCase.paramCase(layerName))
    }
    // Layername
    name = name.replace(/%\*/g, layerName)
    return String(name)
  }

  layer(options) {
    let newLayerName = options.inputName

    // Interator
    const nInterators = newLayerName.match(this.shortcut(numberSequence))
    const aInterators = newLayerName.match(/(?!%ar%)%A/gi)
    const reverseAInterators = newLayerName.match(this.shortcut(alphaReverse))
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
      newLayerName = newLayerName.replace(this.shortcut(alphaReverse), replaceAlpha)
    }
    if (aInterators != null) {
      newLayerName = newLayerName.replace(this.shortcut(alphaSequence), replaceAlpha)
    }

    // Replace asterisks
    newLayerName = _this.currentLayer(newLayerName, options.layerName)

    // Add Width and/or height
    newLayerName = newLayerName.replace(this.shortcut(width), options.width)
    newLayerName = newLayerName.replace(this.shortcut(height), options.height)

    // Page Name
    if (this.allowPageName) {
      newLayerName = newLayerName.replace(this.shortcut(page), options.pageName)
    }

    // Parent Name
    if (this.allowParent) {
      newLayerName = newLayerName.replace(this.shortcut(parent), options.parentName)
    }

    // Symbol Name
    if (this.allowSymbol) {
      newLayerName = newLayerName.replace(this.shortcut(symbol), options.symbolName)
    }

    // Layer Style
    if (this.allowLayerStyle) {
      newLayerName = newLayerName.replace(this.shortcut(layerStyle), options.layerStyle)
    }

    // Child Layer Name
    if (this.allowChildLayer) {
      newLayerName = newLayerName.replace(this.shortcut(childLayer), options.childLayer)
    }

    // Return new name
    return newLayerName
  }
}

export default Rename
