import {DateTime} from "luxon";

export function obtenirDateFR(date:Date){
    return DateTime.fromJSDate(date).setLocale('fr').toFormat('dd-MM-yyyy HH:mm:ss')
}