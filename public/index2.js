$(document).ready(function (){
    console.log("documento cargado");

    loadDatos();

    $('[data-action="loadDato"]').off('click').on('click',function (){
        //DatosManager.loadDato($(this).data('id'));
        //console.log("boton agregar"+$(this).data('id'));
        id = $(this).data('id');
        modal(id);
    });
    $('[data-action="saveDato"]').off('click').on('click',function (e){
        console.log("boton save dato");
        id = $(this).data('id');
        console.log(id);

    });


});

function modal(id){
    /*$('#modal_container').load('/Administracion/ajaxloadDato',{async:false,id:id},function(){
        $('#modal_datos').modal('show');
    });*/
    console.log('funcion');
    $.ajax({
      url: '/Administracion/ajaxloadDato',
      data: {
        id: id
      },
      lockContainer: true,
      checkResponse: true,
      success: function(response){
       
        $('#modal_datos').modal('show');
      }
    });
}
function loadDatos(){
    $.ajax({
        url: '/Administracion/ajaxLoadDatos',
        type: 'post',
        data: null,
        async: false,
        success:function(response){
            $('#container_datos').html(response);
            /*$('[data-action="loadDato"]').off('click').on('click',function (){
                id = $(this).data('id')
                modal(id);
            });*/
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
