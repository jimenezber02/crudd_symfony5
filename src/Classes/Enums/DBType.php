<?php
namespace App\Classes\Enums;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\ParameterType;

final class DBType extends BasicEnum
{
    const INT = ParameterType::INTEGER;
    const INT_ARRAY = Connection::PARAM_INT_ARRAY;
    const STRING = ParameterType::STRING;
    const STRING_ARRAY = Connection::PARAM_STR_ARRAY;
    const BINARY = ParameterType::BINARY;
    const BOOL = ParameterType::BOOLEAN;
    const LOB = ParameterType::LARGE_OBJECT;
    const NULL = ParameterType::NULL;

    public static function inferFromValue($value)
    {
        switch (gettype($value))
        {
            case gettype(false): return self::BOOL;
            case gettype(0): return self::INT;
            case gettype(null): return self::NULL;
            case gettype([]):
                foreach ($value as $key => $v)
                    if(self::inferFromValue($v) !== self::INT)
                        return self::STRING_ARRAY;
                return self::INT_ARRAY;

            default:
                return self::STRING;
        }
    }
}