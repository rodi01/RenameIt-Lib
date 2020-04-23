// eslint-disable-next-line no-unused-vars
import Mocha from "mocha"
import { assert } from "chai"
import Rename from "../src/Rename"
import FindReplace from "../src/FindReplace"

describe("Rename Layers", () => {
  const mockData = {
    layerName: "Current Layer",
    currIdx: 0,
    width: 10,
    height: 20,
    startsFrom: 0,
    pageName: "page name",
    parentName: "parent",
    inputName: "New %*",
    symbolName: "master symbol",
    selectionCount: 0,
    layerStyle: "layer style",
    childLayer: "child layer"
  }
  const rename = new Rename()

  describe("Current Name", () => {
    it("should return New Current Layer", () => {
      assert.equal(rename.layer(mockData), "New Current Layer")
    })
  })

  describe("Sequence", () => {
    it("should return in sequence ASC", () => {
      for (let index = 0; index < 10; index += 1) {
        const element = JSON.parse(JSON.stringify(mockData))
        element.selectionCount = 10
        element.currIdx = index
        element.startsFrom = 1
        element.inputName = "Item %N"
        assert.equal(rename.layer(element), `Item ${index + element.startsFrom}`)
      }
    })
    it("should return in sequence DESC", () => {
      for (let index = 0; index < 10; index += 1) {
        const element = JSON.parse(JSON.stringify(mockData))
        element.selectionCount = 10
        element.currIdx = index
        element.startsFrom = 1
        element.inputName = "Item %n"
        const num = element.selectionCount - element.currIdx - 1
        assert.equal(rename.layer(element), `Item ${num + element.startsFrom}`)
      }
    })

    it("should paddy numbers", () => {
      const element = JSON.parse(JSON.stringify(mockData))
      element.inputName = "%NN"
      element.selectionCount = 11
      assert.equal(rename.layer(element), "00")
    })

    it("should start from", () => {
      for (let index = 0; index < 10; index += 1) {
        const element = JSON.parse(JSON.stringify(mockData))
        element.selectionCount = 10
        element.currIdx = index
        element.startsFrom = 10
        element.inputName = "Item %n"
        const num = element.selectionCount - element.currIdx - 1
        assert.equal(rename.layer(element), `Item ${num + element.startsFrom}`)
      }
    })

    it("should sort in alphabetical order", () => {
      const element = JSON.parse(JSON.stringify(mockData))
      element.inputName = "%A"
      element.currIdx = 1
      element.selectionCount = 2
      assert.equal(rename.layer(element), "B")
    })
  })

  describe("Text cases", () => {
    const element = JSON.parse(JSON.stringify(mockData))
    element.layerName = "test NAME"

    it("should titlecase", () => {
      element.inputName = "%*t%"
      assert.strictEqual(rename.layer(element), "Test Name")
    })

    it("should uppercase", () => {
      element.inputName = "%*u%"
      assert.strictEqual(rename.layer(element), "TEST NAME")
    })

    it("should upper case first", () => {
      element.inputName = "%*uf%"
      assert.strictEqual(rename.layer(element), "Test NAME")
    })
    it("should camelCase", () => {
      element.inputName = "%*c%"
      assert.strictEqual(rename.layer(element), "testName")
    })

    it("should Param case", () => {
      element.inputName = "%*pc%"
      assert.strictEqual(rename.layer(element), "test-name")
    })

    it("should lowercase", () => {
      element.layerName = "TEST name"
      element.inputName = "%*l%"
      assert.strictEqual(rename.layer(element), "test name")
    })
  })

  describe("Dimensions", () => {
    const element = JSON.parse(JSON.stringify(mockData))

    it("should width", () => {
      element.inputName = "%w"
      assert.equal(rename.layer(element), "10")
    })

    it("should height", () => {
      element.inputName = "%h"
      assert.equal(rename.layer(element), "20")
    })
  })

  describe("Page and Parent", () => {
    const element = JSON.parse(JSON.stringify(mockData))
    it("should parent", () => {
      element.inputName = "%o"
      assert.equal(rename.layer(element), "parent")
    })

    it("should page", () => {
      element.inputName = "%p"
      assert.equal(rename.layer(element), "page name")
    })

    it("should ignore parent", () => {
      rename.allowParent = false
      element.inputName = "%o"
      assert.equal(rename.layer(element), element.inputName)
    })

    it("should ignore page", () => {
      rename.allowPageName = false
      element.inputName = "%p"
      assert.equal(rename.layer(element), element.inputName)
    })
  })

  describe("Symbols", () => {
    const element = JSON.parse(JSON.stringify(mockData))
    it("should use symbol name", () => {
      element.inputName = "%s"
      assert.equal(rename.layer(element), "master symbol")
    })

    it("should be empty", () => {
      element.inputName = "%s"
      element.symbolName = ""
      assert.isEmpty(rename.layer(element))
    })

    it("should ignore symbols", () => {
      element.inputName = "%s"
      rename.allowSymbol = false
      assert.equal(rename.layer(element), element.inputName)
    })
  })

  describe("Styles", () => {
    const element = JSON.parse(JSON.stringify(mockData))
    it("should layer styles", () => {
      element.inputName = "%ls%"
      assert.equal(rename.layer(element), "layer style")
    })

    it("should ignore layer style", () => {
      element.inputName = "%ls%"
      rename.allowLayerStyle = false
      assert.equal(rename.layer(element), element.inputName)
    })
  })

  describe("Child Layer", () => {
    const element = JSON.parse(JSON.stringify(mockData))
    it("should Child Layer", () => {
      rename.allowChildLayer = true
      element.inputName = "%ch%"
      assert.equal(rename.layer(element), "child layer")
    })

    it("should ignore child layer", () => {
      element.inputName = "%ch%"
      rename.allowChildLayer = false
      assert.equal(rename.layer(element), element.inputName)
    })
  })
})

describe("Find and Replace", () => {
  const options = {
    layerName: "Current layer",
    caseSensitive: false,
    findText: "current",
    replaceWith: "boo"
  }

  const findReplace = new FindReplace()

  it("should match", () => {
    assert.isTrue(findReplace.match(options))
  })

  it("should case sensitive", () => {
    options.caseSensitive = true
    assert.isNotTrue(findReplace.match(options))
  })

  it("should replace", () => {
    options.caseSensitive = false
    assert.equal(findReplace.layer(options), `${options.replaceWith} layer`)
  })

  it("Should match same text", () => {
    options.layerName = "Testing"
    options.findText = "Testing"
    console.log(options)
    assert.isTrue(findReplace.match(options))
  })
})
