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
        $nombre = $request->get('nombre');
        $id = $request->get('id');
        $activo = $request->get('activo');
        $pageactive = $request->get('page') ?? PaginationConfig::PAGE;
        $perpage = $request->get('perpage') ?? PaginationConfig::PERPAGE;

        $em = $this->getDoctrine()->getManager();

        $datos = $em->getRepository('App:Datos')->findDatos([
            'id' => $id,
            'nombre' => $nombre,
            'activo' => $activo
        ]);

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

        if($imagen){
            $imagenName = $fileUploader->upload($imagen,"datos");
            $datos->setImagen($imagenName);
        }

        $em->persist($datos);
        $em->flush();
        return new JsonResponse('OK');
    }

    /**
     * @Route("/ajaxDeleteDato", name="ajaxDeleteDato")
     */
    function ajaxDeleteDato(Request $request):Response
    {
        $id = $request->get('id');
        $em = $this->getDoctrine()->getManager();

        $dato = null;
        $dato = $em->getRepository('App:Datos')->find($id);
        $em->remove($dato);
        $em->flush();

        return new JsonResponse($dato->getNombre());
    }
}
