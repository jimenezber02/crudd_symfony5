$(document).ready(function (){
    console.log("documento cargado");

    loadDatos();

    $('[data-action="loadDato"]').off('click').on('click',function (){
        //DatosManager.loadDato($(this).data('id'));
        console.log("boton agregar"+$(this).data('id'));
        $('#modal_container').load('/Administracion/ajaxloadDato',{id:2},function(){
            $('#modal_datos').modal('show');
        });
    });
});

function loadDatos(){
    $.ajax({
        url: '/Administracion/ajaxLoadDatos',
        type: 'post',
        data: null,
        success:function(response){
            $('#container_datos').html(response);
            //console.log(response);
        }
    });
}
function preview(input){
    var file = $('input[type=file]').get(0).files[0];
    if(file){
      var reader = new FileReader();
      reader.onload = function (){
        $('.image-input').attr("style","background-image: url("+reader.result+")");
        console.log(reader);
      }
      reader.readAsDataURL(file);
    }
  }
