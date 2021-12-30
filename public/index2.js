$(document).ready(function (){
    console.log("documento cargado");

    $('[data-action="loadDato"]').off('click').on('click',function (){
        //DatosManager.loadDato($(this).data('id'));
        console.log("boton agregar");
        $('#modal_container').append()
        $('#modal_datos').modal('show');
    });
});
