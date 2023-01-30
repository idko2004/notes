# Cifrado en notas
## Cómo funcionaba
1. Al cargar el sitio web, se comprueba si se tiene guardado el id del dispositivo`(_id)`, un número generado aleatoriamente y la clave de cifrado`(_pswrd2)`, que es con la que se va a cifrar el contenido de las llamadas http.
2. Se realiza una petición para iniciar sesión, cifrando los datos con con `_pswrd2` y usando `_id` como identificador.
3. Al realizar la llamada para iniciar sesión, se reciben, la clave de identificación del usuario`(_login)` y otra clave de cifrado`(_pswrd)`, que son las que se van a utilizar a partir de ahora en cada llamada. Siendo `_login` el identificador y `_pswrd` la clave de cifrado.

## Cómo debe funcionar ahora
1. Para simplificar la forma en la que funciona el cifrado y para hacerlo más seguro, sólo se debería de usar el id del dispositivo`(_id)` y una contraseña de cifrado`(_pswrd)`.
2. Se dejaría de usar `_pswrd2` ya que tener dos claves de cifrado es algo inútil.
3. `_login` no se dejaría de usar, pero ya no serviría como identificador para la clave de cifrado, y sólo será utilizado para autenticar al usuario.
4. Como `_login` sirve para autenticar al usuario, debería de formar parte del contenido que se cifra en una petición http, y no estar expuesto, como estaba anteriormente.

## Ejemplo de petición http (`/note`)
### Cómo era anteriormente
```
await encryptHttpCall('/note',
{
    key: _login
    encrypt:
    {
        noteid: (id de la nota)
    }
}, _pswrd);
```

### Cómo debería ser ahora
```
await encryptHttpCall('/note',
{
    id: _id
    encrypt:
    {
        key: _login
        noteid: (id de la nota)
    }
}
```

# Notas en medio del desarrollo
## `loadDeviceIDAndPassword()`
Ahora hay una función llamada `loadDeviceIDAndPassword()` en `frontend/js/crypto.js`.

Esta función sirve para comprobar si existen los valores `_id` y `_pswrd` en `localStorage`.
Si los valores existen devuelve `true`, asigna `_id` a la variable `deviceID` y `_pswrd` a `theOtherSecretThing`.
Si los valores no existen sólo devuelve `false`.

Esta función sólo debería ser llamada una vez por cada html, y las variables `deviceID` y `theOtherSecretThing` asignadas a través de esta función, excepto cuando se vaya a asignar una nueva clave porque la que estaba guardada no es válida o no había clave guardada.

## Iniciar sesión
### `/login`
#### Lo que debería enviarse
```
await encryptHttpCall('/login',
{
    deviceID,
    encrypt:
    {
        email
    }
}, theOtherSecretThing);
```

#### Lo que debería recibirse
```
{
    emailSent: true
}
```

### `/loginCode`
#### Lo que debería enviarse
```
await encryptHttpCall('/loginCode',
{
    deviceID,
    encrypt:
    {
        code,
        email
    }
}, theOtherSecretThing
```

#### Lo que debería recibirse
```
{
    decrypt:
    {
        key
    }
}
```