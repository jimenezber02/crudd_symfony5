<?php

define('TARGETFOLDER',__DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'var'.DIRECTORY_SEPARATOR);

function deleteRecursive($target, $purgeRoot=true){

    /*if(file_exists($target)){
        echo "Eliminado: $target";
    }else{
        echo "no existe: $target";
    }*/
    //echo "<br>";
    if(is_dir($target)){
        $files = glob($target.DIRECTORY_SEPARATOR.'**');
        foreach ($files as $current){
            deleteRecursive($current);
        }
        //echo "este es el fichero $target";
        if($purgeRoot) rmdir($target);
    }

    if(is_file($target)){
        unlink($target);
    }
}

deleteRecursive(TARGETFOLDER."cache", false);
//deleteRecursive(TARGETFOLDER."logs", false);
echo "The cache and logs files has been deleted with successful!";