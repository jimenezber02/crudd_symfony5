<?php
namespace App\Classes;
/**
 * 2021-2021 Advanced Eccomerce All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of PrestaAdvanced and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to PrestaAdvanced
 * and its suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from PrestaAdvanced
 *
 * @author    Advanced Eccomerce
 * @copyright 2020-2021 Advanced Eccomerce
 * @license  Advanced Eccomerce All Rights Reserved
 *  International Registered Trademark & Property of Advanced Eccomerce
 */

use App\Classes\Enums\DBType;
use AppBundle\Classes\SmtAppContext;
use Db;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Driver\ResultStatement;

/**
 * @TODO Considerar una jerarquia de constructores de consultas (una clase para cada consulta)
 * @TODO    Considerar que esta clase tenga conocimiento de la DBConnection
 *          para que las consultas generadas sean independientes de la
 *
 */
class SmtQueryBuilder
{
    private $sql = null;
    private $params = [];
    private $types = [];

    private $type = "";
    private $query = [];

    private $inserteJoin = [];
    private $insertedSelect = [];

    private $conn = null;

    protected const TYPES_MAP = [
        'int' => DBType::INT,
        'int_array' => DBType::INT_ARRAY,
        'string' => DBType::STRING,
        'string_array' => DBType::STRING_ARRAY,
        'binary' => DBType::BINARY,
        'bool' => DBType::BOOL,
        'lob' => DBType::LOB,
        'null' => DBType::NULL,
    ];

    protected function __construct(string $type)
    {
        $this->type = strtolower($type);
        $this->query = [];
    }

    #region QUERY CREATIONS

    public static function select(): SmtQueryBuilder
    {
        return new self(__FUNCTION__);
    }

    public static function insert(): SmtQueryBuilder
    {
        return new self(__FUNCTION__);
    }

    public static function update(): SmtQueryBuilder
    {
        return new self(__FUNCTION__);
    }

    public static function delete(): SmtQueryBuilder
    {
        return new self(__FUNCTION__);
    }
    /*public static function insertSelect() : SmtQueryBuilder
    {
        return new self(__FUNCTION__);
    }*/

    #endregion

    /**
     * Obtiene
     * @return string
     */
    public function toSql(): string
    {
        if ($this->sql === null) {
            $builderMethod = "build" . $this->type;
            $this->sql = $this->$builderMethod();
        }
        return $this->sql;
    }

    protected function convertByType($value, $type)
    {

    }

    /**
     * Obtiene un array cuyos valores son los argumentos a utilizar durante la ejecucion de la consulta generada.
     *
     * Si los parametros usados son posicionales (? o { }) entonces el array devuelto es numerico, donde los indices
     * corresponden a la posicion del parametro en la consulta.
     *
     * Si los parametros usados son nombrados entonces el array devuelto es un mapa donde las llaves son los nombres
     * de los parametros
     *
     * @return array
     */
    public function getParams(): array
    {
        return $this->params ?? [];
    }

    /**
     * Obtiene un array(mapa) donde los(las) indices(llaves) son la(el) posicion(nombre) de los parametros
     * y donde los valores respectivos son el tipo, entiendase binding-type, del parametro
     *
     * @return array
     */
    public function getTypes(): array
    {
        return $this->types ?? [];
    }

    public function __debugInfo()
    {
        // Guardar el estado actual de la consulta
        $params = $this->params;
        $types = $this->types;
        $sql = $this->sql;

        // Crear informacion de depuracion
        $debugPreparedSql = $this->toSql();
        $debugParams = $this->getParams();
        $debugTypes = $this->getTypes();
        $debugCompiledSql = $this->compile(
            $debugPreparedSql,
            $debugParams,
            $debugTypes,
            $debugErrors
        );

        $debugInfo = [
            'PreparedStatement' => $debugPreparedSql,
            'BoundParameters' => $debugParams,
            'BoundTypes' => $debugTypes,
            'CompiledStatement' => $debugCompiledSql,
            'ErrorsFound' => $debugErrors
        ];

        // Restaurar el estado inicial de la consulta
        $this->params = $params;
        $this->types = $types;
        $this->sql = $sql;

        return $debugInfo;
    }

    private function compile(string $preparedSql, array $params, array $types, array &$debugErrors = null): string
    {
        $formalNamedParamsCount = preg_match_all("/:[_a-zA-Z]/", $preparedSql);
        $formalPosParamsCount = preg_match_all("/\?/", $preparedSql);

        $posParamsCount = 0;
        $namedParamsCount = 0;
        $compiledSql = $preparedSql;
        $lastPosParamOffset = 0;

        foreach ($params as $name => $value) {
            $value = $this->convertToSqlString($value, $types[$name] ?? DBType::STRING);

            if (is_int($name)) {
                $posParamsCount++;

                $i = stripos($compiledSql, "?", $lastPosParamOffset);

                if ($i === false)
                    $debugErrors[] = ["No se encontro un placeholder '?' o {type} para el argumento $value"];
                else
                    $compiledSql = substr_replace($compiledSql, $value, $i, 1);
            } else {
                $namedParamsCount++;
                $compiledSql = str_replace(
                    ":$name",
                    $value,
                    $compiledSql,
                    $hitsCount
                );

                if ($hitsCount === 0) {
                    $debugErrors[] = ["El parametro nombrado ':$name' no se usa en la consulta y aun asi fue bindeado"];
                    continue;
                }
            }
        }

        if ($formalNamedParamsCount * $formalPosParamsCount !== 0)
            $debugErrors[] = "No se pueden mezclar parametros posicionales y nombrados";

        if ($namedParamsCount < $formalNamedParamsCount || $posParamsCount < $formalPosParamsCount)
            $debugErrors[] = "La cantidad de parametros bindeado no coincide con la cantidad de parametros formales de la consulta";

        return $compiledSql;
    }

    private function convertToSqlString($value, $type)
    {
        switch ($type) {
            case DBType::INT:
                return sprintf("%d", $value);

            case DBType::INT_ARRAY:
            case DBType::STRING_ARRAY:
                $type = $type === DBType::INT_ARRAY ? DBType::INT : DBType::STRING;
                $values = (array)$value;
                foreach ($values as $i => $val)
                    $value[$i] = $this->convertToSqlString($val, $type);
                return implode(", ", $values);

            default:
                return sprintf("'%s'", str_replace("'", "''", $value));
        }
    }

    #region FLAGS AND OPTIONS

    /**
     * Define si se debe usar OR para concatenar los wheres
     *
     * @param bool $enabled Habilita o desabilita
     * @return SmtQueryBuilder
     */
    public function useWhereX(bool $enabled = true): SmtQueryBuilder
    {
        $this->query['useOrWheres'] = $enabled;
        return $this;
    }

    /**
     * En el contexto de una consulta SELECT o INSERT-SELECT, especifica que las filas obtenidas deben ser distintas
     *
     * @param bool $enabled Habilita o desabilita el DISTINCT
     * @return SmtQueryBuilder
     */
    public function distinct(bool $enabled = true): SmtQueryBuilder
    {
        $this->query['select_flags']['DISTINCT'] = $enabled;
        return $this;
    }

    public function sqlCalcFoundRows(bool $enabled = true): SmtQueryBuilder
    {
        $this->query['select_flags']['SQL_CALC_FOUND_ROWS'] = $enabled;
        return $this;
    }

    /**
     * Especifica que la clausula GROUP BY debe ejecutarse WITH ROLLUP. Este metodo no tendra ningun efecto
     * en consultas que no utilicen GROUP BY
     *
     * @param bool $enabled
     * @return SmtQueryBuilder
     */
    public function withRollup(bool $enabled = true): SmtQueryBuilder
    {
        $this->query['group_flags']['WITH ROLLUP'] = $enabled;
        return $this;
    }

    /**
     * En el contexto de una consulta INSERT, UPDATE o DELETE especifica la bandera IGNORE que tiene la siguiente
     * semantica:
     *      1- Los errores sintacticos se tratan normalmente (abortar la ejecucion)
     *      2- Los errores semanticos se emiten como warnings, permitiendo la ejecucion.
     *
     *      Tipos de errores semanticos y resolucion:
     *          1-  Indice unico duplicado. Esto aplica para INSERT y UPDATE. Cuando la ejecucion provoca que
     *              un indice unico (en particular la llave primaria) se repita, entonces el SGBD lo resuelve
     *              ignorando la insercion/actualizacion de la fila. Esto es particularmente conveniente cuando
     *              se hacen inserciones/actualizaciones masivas
     *
     *          2-  Cuando se viola la integridad referencial. Aplica para UPDATE y DELETE. Cuando la eliminacion
     *              o actualizacion de una fila provoca conflictos de integridad referencial, entonces esa fila
     *              no es eliminada o actualizada
     *
     *          3-  Cuando una actualizacion provoca errores de tipo, por ejemplo null en una columna NOT NULL,
     *              -1 en una columna INT UNSIGNED etc, el SGBD modifica valor para que se ajuste lo mejor
     *              posible al tipo de columna en concreto. La actualizacion se efectua
     *
     * Ver la documentacion de SQL para mas detalle
     *
     * @param bool $enabled
     * @return SmtQueryBuilder
     */
    public function ignore(bool $enabled = true): SmtQueryBuilder
    {
        $this->query['insert_flags']['IGNORE'] = $enabled;
        $this->query['delete_flags']['IGNORE'] = $enabled;
        $this->query['update_flags']['IGNORE'] = $enabled;

        return $this;
    }

    /**
     *
     * @param bool $enabled
     * @return SmtQueryBuilder
     */
    public function forUpdate(bool $enabled = true): SmtQueryBuilder
    {
        $this->query['select_options'] = ['FOR UPDATE' => $enabled];
        return $this;
    }

    public function lockInShareMode(bool $enabled = true): SmtQueryBuilder
    {
        $this->query['select_options'] = ['LOCK IN SHARE MODE' => $enabled];
        return $this;
    }

    public function onDuplicateKey(bool $enabled = true): SmtQueryBuilder
    {
        $this->query['on_duplicate_key_update'] = $enabled;
        return $this;
    }

    #endregion FLAGS AND OPTIONS

    public function column(string $column, string $alias = null): SmtQueryBuilder
    {
        return $this->columnExpression($column, $alias);
    }

    public function columnExpression(string $expression, string $alias = null, ...$posArgs): SmtQueryBuilder
    {
        $selectExpression = $this->extractPositionalParamsAndTypes($expression, $posArgs);
        $selectExpression['alias'] = $alias ?? $selectExpression['sql'];
        if (!in_array($selectExpression['alias'], $this->insertedSelect)) {
            $this->query['selectExpressions'][] = $selectExpression;

            $this->insertedSelect[] = $selectExpression['alias'];
        }

        return $this;
    }

    public function resetColumn($alias)
    {
        if (($key = array_search($alias, $this->insertedSelect)) !== false) {

            unset($this->insertedSelect[$key]);
            //elimino de select expression

            foreach ($this->query['selectExpressions'] as $qkey => $expression) {
                if ($expression['alias'] == $alias) {
                    unset($this->query['selectExpressions'][$qkey]);
                    break;
                }
            }

        }

    }

    /**
     * Añade un par columna = expresion a la lista de asignacion (SET) de una consulta UPDATE.
     * Se puede usar tambien en un contexto de INSERT cuando se ha especificado antes onDuplicateKeyUpdate()
     *
     * @param string $column
     * @param string $expression
     * @param mixed ...$posArgs
     * @return SmtQueryBuilder
     */
    public function set(string $column, string $expression, ...$posArgs): SmtQueryBuilder
    {
        $this->query['set'][$column] = $this->extractPositionalParamsAndTypes($expression, $posArgs);
        return $this;
    }

    /**
     * Añade un par columna - expresion en el contexto de INSERT
     * @param string $column
     * @param string $expression
     * @param mixed ...$posArgs
     * @return SmtQueryBuilder
     */
    public function value(string $column, string $expression, ...$posArgs): SmtQueryBuilder
    {
        $insertColumnInfo = $this->extractPositionalParamsAndTypes($expression, $posArgs);
        $this->query['insert_columns'][$column] = $insertColumnInfo;
        return $this;
    }

    /**
     *
     * @param array $paramsNamesToColumnsMap
     * @return SmtQueryBuilder
     */
    public function values(array $paramsNamesToColumnsMap): SmtQueryBuilder
    {
        foreach ($paramsNamesToColumnsMap as $paramName => $columnName) {
            $placeholder = is_int($paramName)
                ? ":$columnName" :
                ":$paramName";

            $this->value($columnName, $placeholder);
        }
        return $this;
    }

    /**
     * Añade una tabla a la lista de tablas separadas por coma en una consulta de SELECT o DELETE.
     *
     * Normalmente, a menos que se quiera un CROSS JOIN
     *
     * @param string $table
     * @param string|null $alias
     * @return $this
     */
    public function from(string $table, string $alias = null)
    {
        $this->query['from'][$alias ?? $table] = $table;
        return $this;
    }

    /**
     * En una consulta INSERT, especifica la tabla donde seran insertado los datos
     * @param string $table
     * @return SmtQueryBuilder
     */
    public function into(string $table): SmtQueryBuilder
    {
        $this->query['insert_table'] = $table;
        return $this;
    }

    /**
     * Añade una tabla a la lista de tablas a actualizar en una consulta UPDATE
     *
     * @param string $table
     * @param string|null $alias
     * @return SmtQueryBuilder
     */
    public function table(string $table, string $alias = null): SmtQueryBuilder
    {
        $this->query['update_tables'][$alias ?? $table] = $table;
        return $this;
    }

    public function innerJoin(string $table, string $alias = null, string $condition = null, ...$posArgs)
    {
        return $this->addJoin("INNER JOIN", $table, $alias, $condition, $posArgs);
    }

    public function leftJoin(string $table, string $alias = null, string $condition = null, ...$posArgs)
    {
        return $this->addJoin("LEFT JOIN", $table, $alias, $condition, $posArgs);
    }

    public function rightJoin(string $table, $alias = null, string $condition = null, ...$posArgs)
    {
        return $this->addJoin("RIGHT JOIN", $table, $alias, $condition, $posArgs);
    }

    /**
     * Añade una restriccion a la consulta. La coleccion de restricciones seran unidas por conjuncion (AND)
     *
     * @param string $condition
     * @param mixed ...$posArgs
     * @return SmtQueryBuilder
     */
    public function where(string $condition, ...$posArgs): SmtQueryBuilder
    {
        $this->query['where'][] = $this->extractPositionalParamsAndTypes($condition, $posArgs);
        return $this;
    }

    /**
     * Especifica una ordenacion por la columna columna especificada en la direccion especificada.
     *
     * Las columnas en la consulta final seran ordenadas de izquierda a derecha siguiendo la misma secuencia
     * de llamadas a este metodo.
     *
     * Si ya se ha especificado una columna, entonces llamar a este metodo con la misma columna a los sumo hace
     * que cambie la direccion de ordenacion (ASC, DESC) pero la secuencia de las columnas NUNCA CAMBIA.
     *
     * @param string $column La columna por la cual se quiere ordenar
     * @param bool $asc true => ASC, false => DESC
     * @return SmtQueryBuilder
     */
    public function orderBy(string $column, ?bool $asc = true): SmtQueryBuilder
    {
        $this->query['order'][$column] = $asc;
        return $this;
    }

    /**
     * Especifica un agrupamiento por la columna columna especificada en la direccion especificada.
     *
     * OJO: No todos los sistemas de gestion de bases de datos soportan especificar la direccion de agrupamiento,
     * de modo que esta caracteristica (que SI soporta MySql) debe usarse solamente cuando no haya otra alternativa
     * y en ese supuesto caso deberia comentarse bien que lo que se esta haciendo es dependiente del SGBD.
     *
     * Las columnas en la consulta final seran ordenadas de izquierda a derecha siguiendo la misma secuencia
     * de llamadas a este metodo.
     *
     * Si ya se ha especificado una columna, entonces llamar a este metodo con la misma columna a los sumo hace
     * que cambie la direccion de agrupamiento (ASC, DESC) pero la secuencia de las columnas NUNCA CAMBIA.
     *
     * @param string $column La columna por la cual se quiere agrupar
     * @param bool $asc true => ASC, false => DESC
     * @return SmtQueryBuilder
     */
    public function groupBy(string $column, bool $asc = true): SmtQueryBuilder
    {
        $this->query['groups'][$column] = $asc;
        return $this;
    }

    public function having(string $condition, ...$posArgs): SmtQueryBuilder
    {
        $this->query['having'][] = $this->extractPositionalParamsAndTypes($condition, $posArgs);
        return $this;
    }

    /**
     * Especifica el tamaño de la pagina de resultados. Notese que el tamaño de la pagina coincide con el valor
     * de LIMIT
     *
     * @param int $size
     * @return SmtQueryBuilder
     */
    public function pageSize(int $size): SmtQueryBuilder
    {
        $this->query['limit'] = $size;
        return $this;
    }

    /**
     * Especifica el numero de la pagina a mostrar. Notese que este valor NO COINCIDE con el valor del OFFSET de SQL,
     * sino que este ultimo se computa teniendo en cuenta el numero de la pagina y el tamaño de la misma.
     *
     * @param int $no El numero de la pagina de resultados que se desea.
     * @param bool $zeroBased Indica si el numero de pagina empieza en 0 o 1. true => 0, false => 1
     * @return SmtQueryBuilder
     */
    public function pageNo(int $no, bool $zeroBased = false): SmtQueryBuilder
    {
        // Esta comprobacion es necesaria porque un page size null tiene significado: que no se quiere paginar. Notese
        // que NO QUERER PAGINAR no es lo mismo que NO QUERER MOSTRAR RESULTADOS.
        // De permitir esto, entonces especificar $no = 5 seria lo mismo que $no = 0 (suponiendo zero-based)
        // lo cual es una inconsistencia que probablemente el que llamo a este metodo se le paso de largo
        // una advertencia aqui ahorra minutos de debugging
        if (!isset($this->query['limit']))
            throw new \LogicException("Page size is not defined. Call pageSize() first");

        $no = $zeroBased ? $no : ($no - 1);
        $this->query['offset'] = $no * $this->query['limit'];
        return $this;
    }

    /**
     * Asigna el valor y el tipo especificados al parametro con el nombre especificado.
     * Notese que el parametro es NOMBRADO, no posicional.
     *
     * Cuando se desea asignar un valor a un parametro posicional entonces se usa el parametro $posArgs en el metodo
     * apropiado que lo soporte. el tipo se especifica siguiendo el convenio establecido.
     *
     * El parametro $type acepta un string que es el nombre del tipo que esta implementacion especifica considera.
     * @param string $paramName El nombre del parametro
     * @param mixed $value El valor
     * @param int|string $type El tipo del parametro especificado
     * @return SmtQueryBuilder
     * @see self::TYPES_MAP.
     * Las razon fundamental por la que se usa un string para representar Tipos es porque se pueden incorporar limpiamente
     * a la definicion de las consultas (que son strings) y mejoran la legibilidad.
     *
     * En ultima instancia, el valor "int" o "int_array", etc que se admiten, corresponden a los valores apropiados de
     * las constantes del enumerado ParamType. A su vez este enumerado es una abstraccion de cosas como
     * Connection::PARAM_INT_ARRAY, \Doctrine\DBAL\ParameterType::INTEGER, etc. ParamType representa una forma unificada
     * de acceder a constantes usadas por DBAL y toda su mecanica interna (PDO en particular)
     *
     * El parametro $type acepta tambien un int, que es el valor de alguna de las constantes de ParamType.
     * Aunque, por ejemplo ParamType::INT es igual a \Doctrine\DBAL\ParameterType::INTEGER y por tanto el uso de
     * esta ultima tendria el mismo resultado, ES MUY ACONSEJABLE USAR SIEMPRE las constantes de ParamType.
     *
     */
    public function bind(string $paramName, $value, $type = null): SmtQueryBuilder
    {
        $this->params[$paramName] = $value;

        $this->types[$paramName] = is_int($type)
            ? $type
            : (self::TYPES_MAP[(string)$type] ?? null);

        return $this;
    }

    /**
     * Permite hacer un bind resumido cuando los mapas 'nombre'=>valor y 'nombre'=>tipo son conocidos, es decir,
     * se han computado con anterioridad
     *
     * @param array $params El mapa 'nombre'=>valor de los parametros
     * @param array $types El mapa 'nombre'=>tipo de los tipos de los parametros
     * @return SmtQueryBuilder
     */
    public function bindRange(array $params, array $types = []): SmtQueryBuilder
    {
        foreach ($params as $name => $value) {
            if (is_int($name)) continue;
            $this->bind($name, $value, $types[$name] ?? null);
        }
        return $this;
    }

    /**
     * Este metodo ejecuta esta consulta utilizando la conexion especificada. Nada especial, solo para permitir
     * method-chaining hermosos.
     *
     * @throws DBALException
     * @example
     * // Sea $conn una conexion a base de datos
     *
     *      $products = SmtQueryBuilder::select()
     *          ->from("products")
     *          ->where("id IN(?)", [1,2,3,4,5])
     *          ->executeUsing($conn)
     *          ->fetchAll();
     *
     * // en lugar de
     *      $qb = SmtQueryBuilder::select()
     *          ->from("products")
     *          ->where("id IN(?)", [1,2,3,4,5]);
     *
     *      $products = $conn->executeQuery($qb->toSql(), $qb->getParams(), $qb->getTypes())->fetchAll();
     *
     */
    public function execute()
    {
        $query = $this->compile($this->toSql(), $this->getParams(), $this->getTypes());
        // dump($query);

//        $query = str_replace('PREFIX_', _DB_PREFIX_, $query);
//
//        $f = fopen('sql.txt', 'w+');
//        fwrite($f, $query);
//        fclose($f);

        $result = $this->getDatabase()->executeS($query);

        return $result;
    }

    public function executeUsing(Connection $conn)
    {
        $this->conn = $conn;
        $result = $conn->executeQuery(
            $this->toSql(),
            $this->getParams(),
            $this->getTypes()
        );

        return $result;
    }

    public function getCompleteSql()
    {
        return $this->compile($this->toSql(), $this->getParams(), $this->getTypes());
    }

    protected function getDatabase()
    {
        return Db::getInstance();
    }

    public function getLastInsertId()
    {
        return Db::getInstance()->Insert_ID();
    }

    public function getTotal(): int
    {
        $value = $this->getDatabase()->executeS('select found_rows() as cant');

        return $value[0]['cant'];
    }

    public function getTotalUsing($conn = null): int
    {
        if (!$this->conn)
        {
            $this->conn = $conn;
        }

        /** @var ResultStatement $result */
        $result = $this->conn->executeQuery(
            'select found_rows() as cant',
            $this->getParams(),
            $this->getTypes()
        );

        return $result->fetchColumn(0);
    }

    static function paginate(&$query, $page = null, $perPage = null)
    {
        if (intval($perPage) > 0) {
            //if ($page && $perPage) {
            $query->pageSize($perPage)
                ->pageNo($page ?? 1);
        }
    }

    #region SQL QUERY CREATION HELPERS

    /**
     * @return string
     */
    private function buildSelect(): string
    {
        $sql = "SELECT";

        $sql .= $this->buildFlags($this->query['select_flags'] ?? []);

        $sql .= $this->buildSelectExpressions($this->query['selectExpressions'] ?? null);

        $sql .= $this->buildFromClause($this->query['from'] ?? []);

        $sql .= $this->buildJoins($this->query['joins'] ?? []);

        $conjuntion = ' AND ';
        if (isset($this->query['useOrWheres']) && $this->query['useOrWheres']) {
            $conjuntion = ' OR ';
        }

        $sql .= $this->buildConditions(" WHERE ", $conjuntion, $this->query['where'] ?? []);

        $sql .= $this->buildGroupByClause($this->query['groups'] ?? []);

        $sql .= $this->buildConditions(" HAVING ", $conjuntion, $this->query['having'] ?? []);

        $sql .= $this->buildOrderByClause($this->query['order'] ?? []);

        $sql .= $this->buildLimit($this->query['limit'] ?? null, $this->query['offset'] ?? 0);

        return $sql;
    }

    private function buildInsert(): string
    {
        $sql = "INSERT";
        $sql .= $this->buildFlags($this->query['insert_flags'] ?? []);

        $sql .= $this->buildIntoClause(
            $this->query['insert_table'],
            array_keys($this->query['insert_columns'])
        );

        $sql .= $this->buildValuesClause(array_values($this->query['insert_columns']));

        if ($this->query['on_duplicate_key_update'] ?? false) {
            $sql .= " ON DUPLICATE KEY UPDATE ";
            $sql .= $this->buildAssignmentList($this->query['set']);
        }

        return $sql;
    }

    private function buildUpdate(): string
    {
        $sql = "UPDATE ";
        $sql .= $this->buildFlags($this->query['update_flags'] ?? []);

        $tables = $this->query['update_tables'];
        $sql .= $this->buildTablesList($tables);
        $sql .= " SET " . $this->buildAssignmentList($this->query['set']);

        $conjuntion = ' AND ';
        if (isset($this->query['useOrWheres']) && $this->query['useOrWheres']) {
            $conjuntion = ' OR ';
        }

        $sql .= $this->buildConditions(" WHERE ", $conjuntion, $this->query['where'] ?? []);

        if (count($tables) <= 1) {
            $sql .= $this->buildOrderByClause($this->query['order'] ?? []);
            $sql .= $this->buildLimit($this->query['limit'] ?? null, null);
        }

        return $sql;
    }

    /**
     * @return string
     */
    private function buildDelete(): string
    {
        $tables = $this->query['from'];

        $sql = "DELETE";
        $sql .= $this->buildDeleteTablesList($tables);
        $sql .= $this->buildFromClause($tables);
        if (isset($this->query['where'])) {

            $conjuntion = ' AND ';
            if (isset($this->query['useOrWheres']) && $this->query['useOrWheres']) {
                $conjuntion = ' OR ';
            }

            $sql .= $this->buildConditions("WHERE", $conjuntion, $this->query['where']);
        }

        if (count($tables) === 1) {
            $sql .= $this->buildOrderByClause($this->query['order'] ?? []);
            $sql .= $this->buildLimit($this->query['limit'] ?? null, null);
        }

        return $sql;
    }

    #endregion

    #region SQL QUERY-PARTS CREATION HELPERS

    private function buildSelectExpressions(array $selectExpressions = null): string
    {
        if ($selectExpressions === null) return " *";

        $exprList = [];
        foreach ($selectExpressions as $selectExpr) {
            $expr = $selectExpr['sql'];
            $alias = $selectExpr['alias'];

            if ($alias !== $expr)
                $expr .= " AS $alias";

            $exprList[] = $expr;

            $this->appendParamsAndTypes(
                $selectExpr['args'] ?? [],
                $selectExpr['types'] ?? []
            );
        }
        return " " . implode(", ", $exprList);
    }

    private function buildFlags(array $flags, string $glue = " "): string
    {
        if (empty($flags)) return "";

        $flags = array_keys($flags, true);
        return " " . implode($glue, $flags);
    }

    private function buildFromClause(array $tables): string
    {
        return empty($tables)
            ? ""
            : " FROM " . $this->buildTablesList($tables);
    }

    private function buildTablesList(array $tables): string
    {
        $tablesList = [];

        foreach ($tables as $alias => $table) {
            $format = $alias === $table ? "%s" : "%s AS %s";
            $tablesList[] = sprintf($format, $table, $alias);
        }

        return implode(", ", $tablesList);
    }

    private function buildJoins(array $joins): string
    {
        if (empty($joins)) return "";

        $builtJoins = [];

        foreach ($joins as $join) {
            $builtJoin = sprintf(" %s %s", $join['type'], $join['table']);

            if ($join['table'] != $join['alias'])
                $builtJoin .= " AS " . $join['alias'];

            if ($join['sql'])
                $builtJoin .= " ON " . $join['sql'];

            $builtJoins[] = $builtJoin;

            $this->appendParamsAndTypes($join['params'], $join['types']);
        }

        return implode(" ", $builtJoins);
    }

    private function buildConditions(string $prefix, string $glue, array $conditions): string
    {
        if (empty($conditions)) return "";

        $builtConditions = [];
        foreach ($conditions as $condition) {
            // Esta linea busca disyunciones en la condicion y guarda la cantidad encontrada.
            $sql = str_ireplace([" or", " xor "], [" OR ", " XOR "], $condition['sql'], $disjunctionsCount);

            if ($disjunctionsCount > 0)  // Si hay disyunciones, entonces hay que poner parentesis pues por convenio
                $sql = "($sql)";        // los predicados en SmtQueryBuilder estan en forma normal conjuntiva,
            // es decir, que las partes se unen por AND. Dado que AND tiene mayor precedencia que OR o XOR
            // entonces los parentesis son necesarios para mantener la semantica de la expresion

            $builtConditions[] = $sql;
            $this->appendParamsAndTypes($condition['params'], $condition['types']);
        }
        $builtConditions = implode($glue, $builtConditions);
        $prefix = trim($prefix, " ");
        return " $prefix $builtConditions";

    }

    private function buildOrderByClause(array $columnsOrderWay = null): string
    {
        if (empty($columnsOrderWay)) return "";

        $order = [];

        foreach ($columnsOrderWay as $column => $asc) {
            $orderString = $column;
            if ($asc !== null) {
                $orderString .= ($asc ? " ASC" : " DESC");
            }
            $order[] = $orderString;
        }

        $order = " ORDER BY " . implode(", ", $order);

        return $order;
    }

    private function buildGroupByClause(array $groups, array $flags = []): string
    {
        if (empty($groups)) return "";

        $groupByClause = [];
        foreach ($groups as $expr => $orderWay) {
            $group = $expr;

            if ($orderWay === false)
                $group .= " DESC";

            $groupByClause[] = $group;
        }

        $groupByClause = " GROUP BY " . implode(", ", $groupByClause);

        $flags = $this->buildFlags($flags);
        if (!empty($flags))
            $groupByClause .= " $flags";

        return $groupByClause;
    }

    private function buildLimit(int $limit = null, int $offset = null): string
    {
        if ($limit === null)
            return "";

        $limit = " LIMIT $limit";

        if (!empty($offset))
            $limit .= " OFFSET $offset";

        return $limit;
    }

    private function buildIntoClause($table, array $columns): string
    {
        return " INTO $table(" . implode(", ", $columns) . ")";
    }

    private function buildValuesClause(array $columnsInfo): string
    {
        $expressions = [];
        foreach ($columnsInfo as $info) {
            $expressions[] = $info['sql'];
            $this->appendParamsAndTypes($info['params'], $info['types']);
        }
        return " VALUES(" . implode(", ", $expressions) . ")";
    }

    private function buildAssignmentList(array $columnsExprPairs): string
    {
        $assignmentList = [];
        foreach ($columnsExprPairs as $column => $expr) {
            $assignmentList[] = "$column = " . $expr['sql'];
            $this->appendParamsAndTypes($expr['params'], $expr['types']);
        }
        return implode(", ", $assignmentList);
    }

    private function buildDeleteTablesList(array $tables)
    {
        if (count($tables) === 1) {
            $alias = key($tables);
            $table = current($tables);
            return $alias === $table ? "" : " $alias";
        }

        return " " . implode(", ", array_keys($tables));
    }

    #endregion

    #region PRIVATE HELPERS

    private function addJoin(string $type, $table, $alias, $condition, array $args = []): SmtQueryBuilder
    {
        $join = $this->extractPositionalParamsAndTypes($condition, $args);
        $join['type'] = $type;
        $join['table'] = $table;
        $join['alias'] = $alias ?? $table;

        $this->query['joins'][] = $join;

        $this->inserteJoin[] = $join['table'];

        return $this;
    }

    public function hasJoin(string $table): bool
    {
        return in_array($table, $this->inserteJoin);
    }


    private function appendParamsAndTypes(array $argsList, array $typesList)
    {
        $this->params = array_merge($this->params, $argsList);
        $this->types = array_merge($this->types, $typesList);
    }

    public function extractPositionalParamsAndTypes(string $sql, array $args = []): array
    {
        $sql = str_replace("?", "{}", $sql, $count);

        if (stripos($sql, "{") === false)
            return ['sql' => $sql, 'params' => [], 'types' => []];

        $typesPattern = implode("|", array_keys(static::TYPES_MAP));
        $tokenPattern = "/{\s*(?<type>$typesPattern)?(\s*:\s*(?<pos>\d+))?\s*}/i";

        preg_match_all($tokenPattern, $sql, $tokens);

        $params = [];
        $types = [];
        foreach ($tokens['pos'] as $i => $paramIndex) {
            $paramIndex = (int)($paramIndex === "" ? $i : $paramIndex);
            $paramValue = $args[$paramIndex] ?? null;

            $params[] = $paramValue;
            $types[] = $this->inferType($tokens['type'][$i] ?: 'string', $paramValue);
        }

        $sql = str_replace($tokens[0], "?", $sql);

        return ['sql' => $sql, 'params' => $params, 'types' => $types];
    }

    private function inferType(string $guessType, $value)
    {
        if (is_array($value))
            return $this->inferArrayType($guessType, $value);

        return self::TYPES_MAP[$guessType] ?? null;
    }

    private function inferArrayType(string $guessType, array $array)
    {
        if ($guessType === 'int_array' || $guessType === 'string_array')
            self::TYPES_MAP[$guessType];

        foreach ($array as $value)
            if (!is_int($value))
                return self::TYPES_MAP['string_array'];

        return self::TYPES_MAP['int_array'];
    }

    #endregion
}

/*
SELECT
    [ALL | DISTINCT | DISTINCTROW ]
    [HIGH_PRIORITY] [STRAIGHT_JOIN] [SQL_SMALL_RESULT] [SQL_BIG_RESULT] [SQL_BUFFER_RESULT]
    [SQL_CACHE | SQL_NO_CACHE] [SQL_CALC_FOUND_ROWS]
    select_expr [, select_expr ...]
    [FROM table_references [PARTITION partition_list]
        [WHERE where_condition]
        [GROUP BY {col_name | expr | position} [ASC | DESC], ... [WITH ROLLUP]]
        [HAVING where_condition]
        [ORDER BY {col_name | expr | position} [ASC | DESC], ...]
        [LIMIT {[offset,] row_count | row_count OFFSET offset}]
        [PROCEDURE procedure_name(argument_list)]
        [INTO OUTFILE 'file_name' [CHARACTER SET charset_name] export_options
            | INTO DUMPFILE 'file_name'
            | INTO var_name [, var_name]
        ]
        [FOR UPDATE | LOCK IN SHARE MODE]
    ]

*/
/*
INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {VALUES | VALUE} (value_list) [, (value_list)] ...
    [ON DUPLICATE KEY UPDATE assignment_list]

INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    SELECT ...
    [ON DUPLICATE KEY UPDATE assignment_list]

*/

/*
Single-table syntax:
UPDATE [LOW_PRIORITY] [IGNORE] table_reference
    SET assignment_list
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT row_count]

value:    {expr | DEFAULT}
assignment:    col_name = value
assignment_list:    assignment [, assignment] ...

Multiple-table syntax:
UPDATE [LOW_PRIORITY] [IGNORE] table_references
    SET assignment_list
    [WHERE where_condition]
*/

/*
DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    FROM tbl_name [PARTITION (partition_name [, partition_name] ...)]
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT row_count]

DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    tbl_name[.*] [, tbl_name[.*]] ...
    FROM table_references
    [WHERE where_condition]

DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    FROM tbl_name[.*] [, tbl_name[.*]] ...
    USING table_references
    [WHERE where_condition]

*/