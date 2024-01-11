export const getTime = (timestamp) => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = Math.floor(timestamp % 60);
    const hours = Math.floor(timestamp / 3600);
    return (hours ? `${hours}:` : '') + `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export const getPercentage = (currentTime, endTime) => {
    return parseFloat(currentTime / endTime).toFixed(2)
}

export const getTimeStringToNumber = (str) => {
    const arr = str.split(":")
    if (arr.length === 3) return; //TODO: HOUR
    return +arr[0] * 60 + +arr[1];
}