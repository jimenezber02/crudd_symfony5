$(document).ready(function (){
    console.log("documento cargado");

    $('[data-action="loadDato"]').off('click').on('click',function (){
        //DatosManager.loadDato($(this).data('id'));
        console.log("boton agregar"+$(this).data('id'));
        $('#modal_container').load('/Administracion/ajaxloadDato',{id:2},function(){
            $('#modal_datos').modal('show');
        });
    });
});
