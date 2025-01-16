import os from "os"

export const altaPetError=pet=>{
    let {name, ...otros}=pet   // ... son el operador rest... 
    let detalleError=`
Error al dar de alta una mascota.
Propiedades esperadas:
    - requeridas:
        - name, de tipo string. Se recibió: ${name}
        - specie, de tipo string. 
    - opcionales:
        - 'birthdate - date','adopted - boolean','owner','image - string'. Se recibió: ${JSON.stringify(otros)}

Fecha: ${new Date().toLocaleString()}
Terminal: ${os.hostname()}
Usuario: ${os.userInfo().username}
    `

    return detalleError
}