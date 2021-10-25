<?php
namespace App\Classes\Helpers;
class ImageHelper
{

    public static function getUploadPath($imagefolder, $imagename="")
    {
        //TODO ver como coger el parameter app.dir_upload;
        //$dirupload = $containerBuilder->getParameter('app.dir_upload');
        $dirupload = 'upload';
        return $dirupload.'/'.$imagefolder.'/'.$imagename;
    }

}