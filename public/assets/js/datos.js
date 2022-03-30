$(document).ready(function (){

    loadDatos();

    $('[data-action="loadDato"]').off('click').on('click',function (){
        let id = $(this).data('id');
        modal(id);
    });

    $('[data-action="findDatos"]').off('click').on('click',(e)=>{
        loadDatos();
    });

    $('[data-action="enterFindNombre"]').off('keyup').on('keyup',(e)=>{
        if(e.keyCode == 13){
            loadDatos();
        }
    });

    $('[data-action="enterFindApellido"]').off('keyup').on('keyup',(e)=>{
        if(e.keyCode == 13){
            loadDatos();
        }
    });

    $('[data-action="deleteDato"]').off('click').on('click', function (){
        let id = $(this).data('id');
        deleteDato(id);
    });
});

function loadDatos(){
    var form = $('#form_search_datos');

    $.ajax({
        url: '/Administracion/ajaxLoadDatos',
        data: form.serialize(),
        processData: false,
        lockContainer: true,
        checkResponse: true,
        async: false,
        success:function(response){
            $('#container_datos').html(response);
        },
    }).done(function (response){
        $('[data-action="loadDato"]').off('click').on('click',function (e){
            let id = $(this).data('id')
            modal(id);
        });
        $('[data-action="deleteDato"]').off('click').on('click', function (){
            let id = $(this).data('id');
            deleteDato(id);
        });
    });
}

function modal(id){
    $('#modal_container').load('/Administracion/ajaxloadDato',{id:id},function(e){
        $('#modal_datos').modal('show');
        $('[data-action="saveDato"]').off('click').on('click',function (e){
            let id = $('input[name="id"]').val();
            saveDato(id);
        });

        let elid = document.querySelector("#imagen");
        elid.addEventListener("change",function (){
           preview(this);
        });
    });
}

function saveDato(id){
    var formData = new FormData(document.getElementById('form_datos'));
    var file = $('input[type=file]').get(0).files[0];
    formData.append("imagen",file);

    var form = $('#form_datos')
    validacion(form);
    if(form.valid()){
        $.ajax({
            type: 'post',
            enctype: 'multipart/form-data',
            data: formData,
            url: '/Administracion/ajaxSaveDato',
            withFile: true,
            contentType: false,
            cache: false,
            processData: false,
            success: function (response){
                loadDatos();
                $('#modal_datos').modal('hide');
            }
        });
    }
}

function deleteDato(id){
    if(confirm("Eliminar")){
        $.ajax({
            url: '/Administracion/ajaxDeleteDato',
            data: {id: id},
            async: false,
            success: function (response){
                $('#tr_datos'+id).remove();
                alert("Eliminado "+response)
            }
        });
    }
}

function preview(input){
    var file = $('input[type=file]').get(0).files[0];
    var reader = new FileReader();
    if(file){
      reader.onload = function (){
        //$('.image-input').attr("style","background-image: url("+reader.result+")");
        $('#image-input').attr("src",reader.result);
      }
      reader.readAsDataURL(file);
    }
    return file;
}

function validacion(form){
    form.validate({
        rules:{
            nombre:{
                required: true
            },
            apellido: {
                required: true
            },
            sexo: {
                required: true
            }
        },
        messages:{
            nombre:{
                required: "Nombre no válido"
            },
            apellido:{
                required: "Apellido no válido"
            },
            sexo:{
                required: "Sexo no válido"
            }
        }
    });
}
