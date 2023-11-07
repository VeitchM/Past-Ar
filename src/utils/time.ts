import TS from "../../TS"

/** It retuns a string saying the time passed from a timestamp
 * @example hace 22 minutos
 */
export const timePassedString = (timestamp: number) => {
    let timePassed = TS.t("no_measurements")

    if (timestamp > 0) {
        timePassed = ''

        const milisecondsPassed = Date.now() - timestamp
        const hoursPassed = milisecondsPassed / (3600 * 1000)
        console.log({ milisecondsPassed, hoursPassed });

        if (milisecondsPassed < 60000) {
            const seconds = Math.floor(milisecondsPassed / 1000)
            timePassed = TS.t('second', { count: seconds })
        }
        else if (milisecondsPassed < 1000 * 60 * 60) {
            const minutes = Math.floor(milisecondsPassed / 60000)
            timePassed = TS.t('minute', { count: minutes })
        }
        else if (milisecondsPassed < 1000 * 60 * 60 * 24) {
            const hours = Math.floor(milisecondsPassed / (1000 * 60 * 60))
            timePassed = TS.t('hour', { count: hours })
        }
        else {
            const days = Math.floor(milisecondsPassed / (1000 * 60 * 60 * 24))
            timePassed = TS.t('day', { count: days })
        }
        timePassed = TS.t('ago', { period: timePassed })
    }
    return timePassed
}

export const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}

export const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} hs`
}