var ValidacionManager = {

    urls: null,
    callback: {
        create: null,
    },
    init: function(urls){
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function(){
        $('[data-action="loadValidacion"]').off('click').on('click', function () {
            var id = $(this).data('id');
            ValidacionManager.loadValidacion(id);
        });

        $('[data-action="saveValidacion"]').off('click').on('click', function () {
            ValidacionManager.saveValidacion();
        });

        $('[data-action="deleteValidacion"]').off('click').on('click', function () {
            var id = $(this).data('id');
            ValidacionManager.deleteValidacion(id);
        });

        $('[data-action="enterFindValidacion"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                ValidacionManager.loadValidaciones();
            }
        });

        $('[data-action="findValidacion"]').off('click').on('click', function () {
            ValidacionManager.loadValidaciones();
        });
    },

    loadValidaciones: function (page= 1){
        var form_search = $('#form_search');
        TML.ajax({
            url: ValidacionManager.urls.loadValidaciones,
            data: form_search.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_validaciones').html(response);
                TableManager.initTable('#table_validaciones', ValidacionManager.loadValidaciones);
                ImageManager.initPreviewImagen();
                ValidacionManager._initEvents();
            }
        });
    },

    loadValidacion: function (id){
        TML.ajax({
            url: ValidacionManager.urls.loadValidacion,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalAuxContainer(response);
                $('#modal_validacion').modal('show');
                FormFielsManager.initLoadImagen();
                ImageManager.initPreviewImagen();
                ValidacionManager._initEvents();
            }
        });
    },

    saveValidacion: function (){
        var form_validacion = $('#form_validacion');
        if(form_validacion.valid()){
            form_validacion = new FormData(document.getElementById("form_validacion"));
            TML.ajax({
                url: ValidacionManager.urls.saveValidacion,
                data: form_validacion,
                lockContainer: true,
                checkResponse: true,
                withFile: true,
                callback: function(response){
                    if (!ValidacionManager.callback.create){
                        ValidacionManager.loadValidaciones();
                    }else{
                        ValidacionManager.callback.create(response);
                    }
                    $('#modal_validacion').modal('hide');
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    deleteValidacion: function (id){
        TML.confirm(function (){
            TML.ajax({
                url: ValidacionManager.urls.deleteValidacion,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#tr_validacion'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },
}


