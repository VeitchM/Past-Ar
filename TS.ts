import { I18n } from "i18n-js";
import en from "./translations/en.json";
import es from "./translations/es.json";

import { getLocales } from "expo-localization";

const TS = new I18n();
TS.locale = getLocales()[0].languageCode;
TS.store(en);
TS.store(es);

export default TS;
