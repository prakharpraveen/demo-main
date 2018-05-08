export const checkInContainer = (GridX, GridY, col, w) => {

    /**防止元素出container */
    if (GridX + w > col - 1) GridX = col - w //右边界
    if (GridX < 0) GridX = 0//左边界
    if (GridY < 0) GridY = 0//上边界
    return { GridX, GridY }
}
