<?php

namespace App\Repository;

use App\Classes\SmtQueryBuilder;
use App\Classes\TMLListResult;
use App\Entity\Datos;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use PhpParser\Node\Expr\Array_;

/**
 * @method Datos|null find($id, $lockMode = null, $lockVersion = null)
 * @method Datos|null findOneBy(array $criteria, array $orderBy = null)
 * @method Datos[]    findAll()
 * @method Datos[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DatosRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Datos::class);
    }

    public function findAllDatos(array $options = null):Array
    {
        $query = $this->createQueryBuilder('d')
            ->orderBy('d.id', 'ASC')
            ;

        if(isset($options['id'])){
            if($options['id'] != ""){
                $query->andWhere('d.id = :val')
                ->setParameter('val', $options['id']);
            }
        }

        if(isset($options['nombre'])){
            $nombre = $options['nombre'];
            $query->andWhere('d.nombre LIKE :val')
                ->setParameter('val', "%$nombre%");
        }

        if(isset($options['activo'])){
            if($options['activo'] != 2){
                $query->andWhere('d.activo = :val')
                    ->setParameter('val', $options['activo']);
            }
        }
        return $query->getQuery()->getResult();
    }
}
