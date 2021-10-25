<?php
namespace App\Classes\Enums;
abstract class BasicEnum
{
    private static $constCacheArray = [];

    /**
     * @return mixed
     * @throws \ReflectionException
     */
    public static function getConstants()
    {
        if (!array_key_exists(static::class, self::$constCacheArray))
        {
            $reflect = new \ReflectionClass(static::class);
            self::$constCacheArray[static::class] = $reflect->getConstants();
        }
        return self::$constCacheArray[static::class];
    }

    public static function isValidName(string $name, bool $ignoreCase = true) : bool
    {
        return self::tryParse($name, $dummy, $ignoreCase);
    }

    public static function isValidValue($value, $strict = true)
    {
        $values = array_values(self::getConstants());
        return in_array($value, $values, $strict);
    }

    /**
     * Intenta obtener el nombre de la entrada cuyo valor es el especificado por $value. Si el valor
     * dado tiene mas de una entrada, entonces se devuelve la primera encontrada.
     *
     * OBS: La primera entrada devuelta NO NECESARIAMENTE es la primera que se definio en el Enum
     * concreto.
     *
     * @example
     *      MyEnum extends BaseEnum
     *
     * @param $value
     * @param string|null $outName
     * @param bool $strict
     * @return bool
     */
    public static function tryGetName($value, string &$outName = null, bool $strict = true)
    {
        $names = self::getNames($value, $strict);

        if(empty($names))
            return false;

        $outName = $names[0];
        return true;
    }

    /**
     * Obtiene un array numerico cuyos valores son los nombres de las entradas que tienen el valor
     * especificado $value
     *
     * @param mixed $value El valor del cual se desea conocer el nombre de las entradas
     * @param bool $strict Indica que la comparacion debe efectuarse estrictamente (===)
     * @return array            El array de nombres de entrada
     * @throws \ReflectionException
     */
    public static function getNames($value, bool $strict = true) : array
    {
        return array_keys(static::getConstants(), $value, $strict);
    }

    /**
     * @param string $name      El nombre de la entrada de la cual se desea el valor
     * @param bool $ignoreCase  Indica que deben ignorarse mayusculas y minusculas en $name
     * @return mixed            El valor de la entrada especificada
     * @throws \Exception       Cuando la entrada especificada no existe
     */
    public static function parse(string $name, bool $ignoreCase = true)
    {
        if(!static::tryParse($name, $value, $ignoreCase))
            throw new Exception("Entry '$name' is not defined in " . static::class);

        return $value;
    }

    /**
     * Intenta obtener el valor de la entrada especificada a traves de $name
     *
     * @param string $name          El nombre de la entrada
     * @param mixed|null $outValue  Parametro de retorno por referencia. En caso de que la entrada exista,
     *                              en este parametro se va a devolver el valor. Si la entrada no existe,
     *                              entonces su valor se deja igual.
     *
     * @param bool $caseInsensitive Especifica si deben ignorarse mayusculas y minusculas
     * @return bool Indica si la entrada existe o no
     * @throws \ReflectionException
     */
    public static function tryParse(string $name, &$outValue = null, bool $caseInsensitive = true) : bool
    {
        $constants = static::getConstants();

        if($caseInsensitive)
        {
            $constants = array_change_key_case($constants, CASE_LOWER);
            $name = strtolower($name);
        }

        if(!array_key_exists($name, $constants))
            return false;

        $outValue = $constants[$name];
        return true;
    }

    /**
     * Dado que para ningun Enum concreto tiene sentido la construccion, se define este constructor final
     * para, de una parte obligar este invariante y de otra para no tener que implementar este invariante
     * en cada Enum concreto
     */
    protected final function __construct() { }

}

/*
// TODO Eliminar esto despues de revisar

abstract class BasicEnum {
    private static $constCacheArray = NULL;

    private static function getConstants() {
        if (self::$constCacheArray == NULL) {
            self::$constCacheArray = [];
        }
        $calledClass = get_called_class();
        if (!array_key_exists($calledClass, self::$constCacheArray)) {
            $reflect = new ReflectionClass($calledClass);
            self::$constCacheArray[$calledClass] = $reflect->getConstants();
        }
        return self::$constCacheArray[$calledClass];
    }

    public static function isValidName($name, $strict = false) {
        $constants = self::getConstants();

        if ($strict) {
            return array_key_exists($name, $constants);
        }

        $keys = array_map('strtolower', array_keys($constants));
        return in_array(strtolower($name), $keys);
    }

    public static function isValidValue($value, $strict = true) {
        $values = array_values(self::getConstants());
        return in_array($value, $values, $strict);
    }
}
*/