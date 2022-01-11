$(document).ready(function (){
    console.log("documento cargado");

    loadDatos();

    $('[data-action="loadDato"]').off('click').on('click',function (){
        //DatosManager.loadDato($(this).data('id'));
        //console.log("boton agregar"+$(this).data('id'));
        modal();
    });



});

function modal(id){
    $('#modal_container').load('/Administracion/ajaxloadDato',{id:id},function(){
        $('#modal_datos').modal('show');

        $('[data-action="saveDato"]').off('click').on('click',function (e){
            console.log(id);
        });
    });
}
function loadDatos(){
    $.ajax({
        url: '/Administracion/ajaxLoadDatos',
        type: 'post',
        data: null,
        success:function(response){
            $('#container_datos').html(response);
            $('[data-action="loadDato"]').off('click').on('click',function (){
                id = $(this).data('id')
                modal(id);
            });
            //console.log(response);
        }
    });
}
function preview(input){
    var file = $('input[type=file]').get(0).files[0];
    if(file){
      var reader = new FileReader();
      reader.onload = function (){
        //$('.image-input').attr("style","background-image: url("+reader.result+")");
        $('#image-input').attr("src",reader.result);
        console.log(reader);
      }
      reader.readAsDataURL(file);
    }
  }
