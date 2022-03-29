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

    public function findAllDatos(array $options = null)
    {
        $qb =$this->createQueryBuilder('d')
        ->addOrderBy('d.id','DESC')
        ;
        $query = $qb;
        if(isset($options['nombre'])) {
            if ($options['nombre'] != "") {
                $nombre = $options['nombre'];
                $qb
                    ->andWhere(
                        $qb->expr()->like('d.nombre',':val')
                    )
                    ->setParameter('val', "%$nombre%")
                ;
            }
        }
        if(isset($options['apellido'])) {
            if ($options['apellido'] != "") {
                $apellido = $options['apellido'];
                $qb
                    ->andWhere(
                        $qb->expr()->like('d.apellido',':val')
                    )
                    ->setParameter('val', "%$apellido%")
                ;
            }
        }
        if(isset($options['activo'])) {
            if ($options['activo'] != 2) {
                $qb
                    ->andWhere(
                        $qb->expr()->eq('d.activo', ':activo')
                    )
                    ->setParameter('activo', $options['activo'])
                ;
            }
        }
        if(isset($options['sexo'])) {
            if ($options['sexo'] != -1) {
                $sexo = $options['sexo'];
                $qb
                    ->andWhere(
                        $qb->expr()->like('d.sexo',':val')
                    )
                    ->setParameter('val', "%$sexo%")
                ;
            }
        }

        return $query->getQuery();
    }
}
