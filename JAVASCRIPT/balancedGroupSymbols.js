const line = '[()]{}{[()()]()}'
const balancedGroupSymbols = line => {
    const brackets = []
    for (let i = 0; i < line.length; i++) {
        const l = line[i]
        if (l === '(' || l === '[' || l === '{') {
            brackets.push(l)
            console.log(brackets)
        } else {
            if (l === ')') {
                if (brackets[brackets.length - 1] === '(') {
                    brackets.pop()
                    console.log(brackets)
                } else {
                    return false
                }
            } else if (l === ']') {
                if (brackets[brackets.length - 1] === '[') {
                    brackets.pop()
                    console.log(brackets)
                } else {
                    return false
                }
            } else if (l === '}') {
                if (brackets[brackets.length - 1] === '{') {
                    brackets.pop()
                    console.log(brackets)
                } else {
                    return false
                }
            }
        }
    }
    return true
}
console.log(balancedGroupSymbols(line))