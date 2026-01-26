export function Column(inner: Array<HTMLElement>) {
    let div = document.createElement("div")
    div.classList = "column"

    for (let n of inner) {
        div.appendChild(n)
    }

    return div
}

export function Row(inner: Array<HTMLElement>) {
    let div = document.createElement("div")
    div.classList = "row"
    for (let n of inner) {
        div.appendChild(n)
    }
    return div
}

export function RowWithClasses(additionalClasses: string, inner: Array<HTMLElement>) {
    let div = Row(inner);
    div.className += " "
    div.className += additionalClasses
    return div
}
