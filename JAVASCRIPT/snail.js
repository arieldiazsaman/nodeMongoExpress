const matrixEg =  [
    [1,2,3],
    [4,5,6],
    [7,8,9]
] 
const matrixPair = [
    [10, 11, 12, 13],
    [21, 22, 23, 14],
    [20, 25, 24, 15],
    [19, 18, 17, 16]
]
const matrixOdd = [
    [10, 11, 12, 13, 14, 15, 16],       //matrixRowGoDown from 0 going down to n |
    [33, 34, 35, 36, 37, 38, 17],       //                                       v
    [32, 49, 50, 51, 52, 39, 18],       
    [31, 48, 57, 58, 53, 40, 19],       
    [30, 47, 56, 55, 54, 41, 20],
    [29, 46, 45, 44, 43, 42, 21],       //                                     ^
    [28, 27, 26, 25, 24, 23, 22]        //matrixRowGoUp from n-1 going up to 0 |

                                        //matrixColumnGoLeft from n-1 going left to 0 <--
                                        //matrixColumnGoRight from 0 going rigth to n -->
]
const nEg = 3
const nPair = 4
const nOdd = 7
const snail = (matrix, n) => {
    const array = []
    let matrixRowGoDown = 0
    let matrixRowGoUp = n - 1
    let matrixColumnGoLeft = n - 1
    let matrixColumnGoRight = 0
    while (matrixRowGoDown < matrixRowGoUp) {
        for (i = 0 + matrixRowGoDown; i < n - matrixRowGoDown; i++) {
            array.push(matrix[matrixRowGoDown][i])
        }
        for (j = 1 + matrixRowGoDown; j < n - 1 - matrixRowGoDown; j++) {
            array.push(matrix[j][matrixColumnGoLeft])
        }
        for (k = n - 1 - matrixRowGoDown; k >= 0 + matrixRowGoDown; k--) {
            array.push(matrix[matrixRowGoUp][k])
        }
        for (l = n - 2 - matrixRowGoDown; l >= 1 + matrixRowGoDown; l--) {
            array.push(matrix[l][matrixColumnGoRight])
        }
        matrixRowGoDown = matrixRowGoDown + 1
        matrixColumnGoLeft = matrixColumnGoLeft - 1
        matrixRowGoUp = matrixRowGoUp - 1
        matrixColumnGoRight = matrixColumnGoRight + 1
        if (matrixRowGoDown == matrixRowGoUp) {
            for (i = 0 + matrixRowGoDown; i < n - matrixRowGoDown; i++) {
                array.push(matrix[matrixRowGoDown][i])
            }
        }
    }
    return array
}
console.log(snail(matrixEg, nEg))
console.log(snail(matrixPair, nPair))
console.log(snail(matrixOdd, nOdd))