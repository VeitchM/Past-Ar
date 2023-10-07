import moment from "moment";

function formatBasicDate(date: Date, divider?:string): string {
    return formatDate(date,'DD-MM-YYYY', divider);
}

function formatExtendedDate(date: Date, divider?:string): string {
    return formatDate(date,'DD-MM-YYYY hh:mm', divider);
}
function formatExtendedDateWithSeconds(date: Date, divider?:string): string {
    return formatDate(date,'DD-MM-YYYY hh:mm:ss', divider);
}

function formatDate(date: Date, format:string, divider?:string): string {
    /** Replace every original divider with a new divider if provided */
    let form = divider && format ? String(format).replace(/-/g,divider) : format;
    let s = moment(date).format(form);
    return s;
}


export default { formatBasicDate, formatExtendedDate, formatDate, formatExtendedDateWithSeconds };