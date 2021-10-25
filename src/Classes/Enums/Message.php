<?php


namespace App\Classes\Enums;


class Message extends BasicEnum
{
    const REGISTER_SUCCESS = 'Felicidades, tu cuenta se ha creado correctamente. Hemos enviado a tu email las instrucciones para activar tu cuenta.';
    const AUTHENTICATION_FAIL = 'Usuario o contraseña incorrecta, por favor inténtelo nuevamente.';
}