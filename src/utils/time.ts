
/** It retuns a string saying the time passed from a timestamp
 * @example hace 22 minutos
 */
export const timePassedString = (timestamp:number) => {
    let timePassed = 'No hubo mediciones '

    if (timestamp >0) {
        timePassed = 'hace '

        const milisecondsPassed = Date.now() - timestamp
        const hoursPassed = milisecondsPassed / (3600*1000)
        console.log({milisecondsPassed, hoursPassed});
        
        if (milisecondsPassed < 60000)
            timePassed += Math.floor(milisecondsPassed / 1000) + ' segundos'
        else if (milisecondsPassed < 1000 * 60 * 60) {
            const minutes = Math.floor(milisecondsPassed / 60000)
            timePassed += `${minutes} minuto${minutes > 1 ? 's' : ''}`
        }
        else if (milisecondsPassed < 1000 * 60 * 60 * 24) {
            const hours = Math.floor(milisecondsPassed / (1000 * 60 * 60))
            timePassed += `${hours} hora${hours > 1 ? 's' : ''}`
        }
        else {
            const days = Math.floor(milisecondsPassed / (1000 * 60 * 60 * 24))
            timePassed += `${days} día${days > 1 ? 's' : ''}`
        }
    }
    return timePassed
}

export const formatDate = (timestamp:number)=>{
    const date = new Date (timestamp)
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}

export const formatTime = (timestamp:number)=>{
    const date = new Date (timestamp)
    return `${date.getHours()}:${date.getMinutes()}hs`
}