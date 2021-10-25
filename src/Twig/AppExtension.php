<?php

namespace App\Twig;


use App\Classes\Enums\FileFolderType;
use App\Classes\ImageHelper;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Symfony\Component\DependencyInjection\ContainerInterface;

class AppExtension extends AbstractExtension
{

    /** @var ContainerInterface */
    protected $container;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('getImage', [$this, 'getImage']),
            new TwigFilter('getFile', [$this, 'getFile']),
            new TwigFilter('formatDataTime', [$this, 'formatDataTime']),
            new TwigFilter('formatDataTime', [$this, 'formatDataTime']),
            new TwigFilter('getConstant', [$this, 'getConstant']),

        ];
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('function_name', [$this, 'doSomething']),
            new TwigFunction('getImage', [$this, 'getImage']),
            new TwigFunction('getFile', [$this, 'getFile']),
            new TwigFunction('getDefaultImage', [$this, 'getDefaultImage']),
            new TwigFunction('getVars', [$this, 'getVars']),
            new TwigFunction('formatDataTime', [$this, 'formatDataTime']),
            new TwigFunction('getPathUploaded',[$this,'getPathUploaded']),
            new TwigFunction('getRepositorioNameForDownload',[$this,'getRepositorioNameForDownload']),
            new TwigFunction('getIfInArray',[$this,'getIfInArray']),
            new TwigFunction('formatDate',[$this,'formatDate']),
            new TwigFunction('formatDateTimeIfObject',[$this,'formatDateTimeIfObject']),
            new TwigFunction('getConstant',[$this,'getConstant'])
        ];
    }

    public function doSomething($value)
    {
        // ...
    }

    public function getImage($folder, $file, $blank='blank.png')
    {
        $base_url = $_ENV['base_url'];
        $url_image = $base_url.'/vendor/metronic/media/avatars/'.$blank;
        if($file && file_exists('upload/'.$folder.'/'.$file)){
            $url_image = $base_url.'/upload/'.$folder.'/'.$file;
        }
        return $url_image;
    }
    public function getFile($folder, $file)
    {
        $urlfile = '';
        if($file && file_exists('upload/'.$folder.'/'.$file)){
            $urlfile = $_ENV['base_url'].'/upload/'.$folder.'/'.$file;
        }
        return $urlfile;
    }

    public function getDefaultImage()
    {
        return $this->getImage('default', 'blank.png');
    }

    public function getRepositorioNameForDownload($filename,$repname){

        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        return str_replace(" ","-",strtolower($repname)).'.'.$ext;

    }

    public function getPathUploaded($key,$filename){
        $vars=[
            "repositorios"=>ImageHelper::getUploadPath(FileFolderType::REPOSITORIO,$filename),
            FileFolderType::CLIENTE_CEDULA => ImageHelper::getUploadPath(FileFolderType::CLIENTE_CEDULA,$filename),
            FileFolderType::CLIENTE_IDONEIDAD =>ImageHelper::getUploadPath(FileFolderType::CLIENTE_IDONEIDAD,$filename)
        ];
        return $vars[$key];
    }
    public function getVars($key){

        $vars=[
            "pathLogo" =>ImageHelper::getUploadPath(FileFolderType::ORGANISMO),
            "pathToAddLogo" =>$this->container->getParameter('kernel.project_dir').'\\public\\upload\\organismo',
            "defaultLogo"=>'/vendor/metronic/media/avatars/blank.png',
        ];

        return $vars[$key];

    }
    public function formatDataTime($date)
    {
        if(!$date){

          $date = date('d-m-Y');
        }
        $date = str_replace(" ","T",$date);
        return $date;
    }
    public function getIfInArray($valor, array $array){
        return in_array($valor,$array);
    }

    public function formatDate($date){

        if(!$date){
            $date = date('d-m-Y');
        }else{
            $date = date_format(date_create($date),"d-m-Y");
        }

        return $date;

    }
    public function formatDateTimeIfObject($date){
        return date_format($date,"d-m-Y");
    }

    public function getConstant($nombreclase_constante)
    {
        return  \constant("App\\Classes\\Enums\\$nombreclase_constante");
    }
}
