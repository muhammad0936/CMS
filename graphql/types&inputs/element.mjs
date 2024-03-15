import elementInput from "../../util/elementInput.mjs"

export default `
input elementInputData {
    ${elementInput}
}

input editedElementInputData {
    _id: Int!
    ${elementInput.replace(/!/g,'')}
}


type Element{
    _id: Int
    ${elementInput}
}

type htmlElement{
    _id: Int!
    ${elementInput}
    elementStyle: [cssCommand]
}
`