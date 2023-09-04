import { I18n } from "i18n-js";
import en from "./translations/en.json"
import es from "./translations/es.json"

const TS = new I18n();
TS.store(en);
TS.store(es);

export default TS;