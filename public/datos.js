var DatosManager = {
    url: null,

    init: function (urls){
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function (){
        $('[data-action="loadDato"]').off('click').on('click',function (){
            DatosManager.loadDato($(this).data('id'));
        });

        $('[data-action="saveDato"]').off('click').on('click',function (){
            DatosManager.saveDato();
        });

        $('[data-action="findDato"]').off('click').on('click',function (){
            DatosManager.loadDatos();
        });
    },
    loadDatos: function (page= 1){
        var form = $('#form_search_datos');
        console.log(form.serialize());
        TML.ajax({
            url: urls.loadDatos,
            data: form.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function (response){
                console.log(response);
                $('#container_datos').html(response);
                TableManager.initTable('#table_datos', DatosManager.loadDatos);
                DatosManager._initEvents();
            }
        });
    },
    loadDato: function (id){
        TML.ajax({
           url: urls.loadDato,
           data: {
               id: id
           },
            lockContainer: true,
            checkResponse: true,
            callback: function (response){
               TML.fillModalContainer(response);
               $('#modal_datos').modal('show');
               FormFielsManager.initLoadImagen();
               ImageManager.initPreviewImagen();
               DatosManager._initEvents();
            }
        });
    },

    saveDato: function (){
        var form = $('#form_datos');
        if(form.valid()){
            var formData = new FormData(document.getElementById('form_datos'));
            TML.ajax({
               url: urls.saveDato,
               data: formData,
                method: 'post',
                withFile: true,
                lockContainer: true,
                checkResponse: true,
                callback: function (response){
                   //DatosManager.saveDato();
                    $('#modal_datos').modal('hide');
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    }
}