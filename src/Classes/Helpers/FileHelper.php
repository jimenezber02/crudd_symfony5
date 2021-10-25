<?php
namespace App\Classes\Helpers;
class FileHelper
{
    public static function getUploadPath($folder)
    {
        $dirupload = 'upload';
        return $dirupload.'/'.$folder;
    }

}