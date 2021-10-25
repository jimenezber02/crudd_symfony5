<?php

namespace App\Repository;

use App\Classes\SmtQueryBuilder;
use App\Classes\TMLListResult;
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

    public function findDatos(array $options = null, $page = null, $perpage = 0)
    {
        /*$query = SmtQueryBuilder::select()
            ->sqlCalcFoundRows()
            ->column('c.id', 'id')
            ->column('c.nombre', 'nombre')
            ->column('c.apellido', 'apellido')
            ->column('c.sexo', 'sexo')
            ->column('c.imagen', 'imagen')
            ->column('c.activo', 'activo')
            ->from('datos', 'c')
        ;
        if(isset($options['nombre'])){
            $nombre = $options['nombre'];
            $query->where("c.nombre LIKE :search")
                ->bind('search', "%$nombre%");
        }
        SmtQueryBuilder::paginate($query,$page, $perpage);

        $datos = $query->executeUsing($this->getEntityManager()->getConnection())->fetchAllAssociative();
        $cant = $query->getTotalUsing();

        return new TMLListResult($datos, $cant);*/
        return $this->getEntityManager()
            ->createQuery('
            SELECT datos.id, datos.nombre, datos.apellido, datos.activo, datos.sexo, datos.imagen
            From App:Datos datos')->getResult();
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
