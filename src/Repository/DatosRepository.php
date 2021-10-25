<?php

namespace App\Repository;

use App\Entity\Datos;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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

    // /**
    //  * @return Datos[] Returns an array of Datos objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Datos
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
