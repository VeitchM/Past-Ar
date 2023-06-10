const ErrorLabelEs = {
    'VALIDATION_ERROR': 'Datos invalidos',
    'AUTH_INVALID_LOGIN': 'Email o contraseña incorrectas',
    'OTHERS' : 'Error del Servidor',
    'FAILED_CONNECTION': 'No se ha podido conectar con el servido'

}
/** If someday it is multilanguage, the language variable will change this line*/
const ErrorLabel = ErrorLabelEs

export const getErrorLabel = (errorLabel: string) => {

    if (errorLabel in ErrorLabel)
        return ErrorLabel[errorLabel as keyof typeof ErrorLabel]
    else
        return ErrorLabel['OTHERS']
}