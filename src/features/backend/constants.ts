import TS from "../../../TS"

const ErrorLabelEs =
{
    'VALIDATION_ERROR': 'session_validation_error',
    'AUTH_INVALID_LOGIN': 'session_auth_invalid_login',
    'OTHERS': 'session_error_others',
    'FAILED_CONNECTION': 'session_failed_connection'
}





/** If someday it is multilanguage, the language variable will change this line*/
const ErrorLabel = ErrorLabelEs

export const getErrorLabel = (errorLabel: string) => {

    if (errorLabel in ErrorLabel)
        return TS.t(ErrorLabel[errorLabel as keyof typeof ErrorLabel])
    else
        return TS.t(ErrorLabel['OTHERS'])
}