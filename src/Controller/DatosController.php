<?php

namespace App\Controller;

use App\Classes\Enums\PaginationConfig;
use App\Classes\FileUploader;
use App\Entity\Datos;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

/**
 * @Route("/Administracion", name="Administracion")
 */
class DatosController extends AbstractController
{
    /**
    * @Route("/datos", name= "datos")
    */
    public function index(): Response
    {
        return $this->render('datos/index.html.twig', [
            'controller_name' => 'DatosController',
        ]);
    }

    /**
     * @Route("/ajaxLoadDatos", name="ajaxLoadDatos")
     */
    function ajaxLoadDatos(Request $request):Response
    {
        $em = $this->getDoctrine()->getManager();
        $pageactive = $request->get('page') ?? PaginationConfig::PAGE;
        $perpage = $request->get('perpage') ?? PaginationConfig::PERPAGE;
        $nombre = $request->get('nombre');
        $id = $request->get('id');
        $activo = $request->get('activo');

        $datos = $em->getRepository('App:Datos')->findDatos([
            'id' => $id,
            'nombre' => $nombre,
            'activo' => $activo
        ]);

        $result = null;
        foreach ($datos as $val){
            $result[] = [
                'id' =>$val['id'],
                'nombre' => $val['nombre'],
                'apellido' => $val['apellido'],
                'sexo' => $val['sexo'],
                'imagen' => $val['imagen'],
                'activo' => $val['activo'],
                'pagecount' => count($datos)
            ];
        }

        /*
        return new JsonResponse([
           $result
        ]);*/


        return $this->render('datos/list.html.twig',[
            'datos'=>$datos->getList(),
            'pagecount' => $datos->getCount(),
            'pageactive' => $pageactive,
            'perpage' => $perpage,
        ]);

    }

    /**
     * @Route("/ajaxloadDato", name="ajaxloadDato")
     */
    function ajaxloadDato(Request $request):Response
    {
        $id = $request->get('id');

        $em = $this->getDoctrine()->getManager();
        $datos = null;
        if($id){
            $datos = $em->getRepository('App:Datos')->find($id);
        }
        return $this->render('datos/datos.html.twig',[
            'datos'=>$datos
        ]);
    }

    /**
     * @Route("/ajaxSaveDato", name="ajaxSaveDato")
     */
    function ajaxSaveDato(Request $request,SluggerInterface $slugger,FileUploader $fileUploader):Response
    {
        $id = $request->get('id');
        $activo = $request->get('activo') ? 1 : 0;
        $nombre = $request->get('nombre');
        $apellido = $request->get('apellido');
        $imagen = $request->files->get('imagen');
        $sexo = $request->get('sexo');

        $em = $this->getDoctrine()->getManager();
        $datos = new Datos();
        if($id){
            $datos = $em->getRepository('App:Datos')->find($id);
        }

        $datos->setNombre($nombre);
        $datos->setApellido($apellido);
        $datos->setSexo($sexo);
        $datos->setActivo($activo);

        /*if ($imagen) {
            $originalFilename = pathinfo($imagen->getClientOriginalName(), PATHINFO_FILENAME);
            // this is needed to safely include the file name as part of the URL
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid().'.'.$imagen->guessExtension();

            // Move the file to the directory where brochures are stored
            try {
                if(file_exists('datos')){
                    $imagen->move(
                        $this->getParameter('imagen_directory/datos'),
                        $newFilename
                    );
                }else{
                    mkdir('imagen_directory/datos',0777,true);
                    $imagen->move(
                        $this->getParameter('imagen_directory/datos'),
                        $newFilename
                    );
                }

            } catch (FileException $e) {
                // ... handle exception if something happens during file upload
            }

            // updates the 'brochureFilename' property to store the PDF file name
            // instead of its contents
            $datos->setImagen($newFilename);
        }*/
        if($imagen){
            $imagenName = $fileUploader->upload($imagen,"datos");
            $datos->setImagen($imagenName);
        }

        $em->persist($datos);
        $em->flush();

        return new JsonResponse('OK');
    }
}
