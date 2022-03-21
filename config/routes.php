use App/Controller\DatosController;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
return function(RoutingConfigurator $routes){
    $routes->add('datos','datos')
    ->controller([DatosController::class, 'index'])
    ;
}