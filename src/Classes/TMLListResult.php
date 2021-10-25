<?php


namespace App\Classes;


class TMLListResult
{
    private $list;
    private $count;

    /**
     * SMTListResult constructor.
     * @param $list
     * @param $count
     */
    public function __construct($list, $count)
    {
        $this->list = $list;
        $this->count = $count;
    }

    /**
     * @return mixed
     */
    public function getList()
    {
        return $this->list;
    }

    /**
     * @return mixed
     */
    public function getCount()
    {
        return $this->count;
    }

    /**
     * @param mixed $list
     */
    public function setList($list): void
    {
        $this->list = $list;
    }

    /**
     * @param mixed $count
     */
    public function setCount($count): void
    {
        $this->count = $count;
    }

}