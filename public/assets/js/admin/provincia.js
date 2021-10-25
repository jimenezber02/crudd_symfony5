var ProvinciaManager = {
    urls: null,

    init: function (urls) {
        this.urls = urls;
        this._initEvents();
    },
    _initEvents: function () {

        $('[data-action="ajaxLoadProvincia"]').off('click').on('click', function () {
            ProvinciaManager.ajaxLoadProvincia($(this).data('id'));

        });


        $('[data-action="saveProvincia"]').off('click').on('click', function (e) {
            ProvinciaManager.ajaxSaveProvincia();

        });

        $('[data-action="findProvincia"]').off('click').on('click', function () {
            ProvinciaManager.ajaxLoadProvincias();
        });

        //
        $('[data-action="ajaxDeleteProvincia"]').off('click').on('click', function () {
            ProvinciaManager.ajaxDeleteProvincia($(this).data('id'));
        });
        //
        $('[data-action="ajaxAddProvincia"]').off('click').on('click', function () {
            ProvinciaManager.ajaxLoadProvincia();

        });
    },

    //carga lista
    ajaxLoadProvincias: function (page = 1){
        var form_search_provincias = $('#form_search_provincia');
        TML.ajax({
            url: urls.loadProvincias,
            data: form_search_provincias.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                $('#container_provincias').html(response);
                TableManager.initTable('#table_provincia', ProvinciaManager.ajaxLoadProvincias);
                ImageManager.initPreviewImagen();
                ProvinciaManager._initEvents();
            }
        });

    },

    ajaxLoadProvincia:function(id = ""){
        TML.ajax({
            url: urls.loadProvincia,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                TML.fillModalContainer(response);
                $('#modal_provincia').modal('show');
                FormFielsManager.initLoadImagen();
                ImageManager.initPreviewImagen();
                ProvinciaManager._initEvents();
            }
        });
    },

    ajaxSaveProvincia:function(){

        var form_provincia = $('#form_provincia');
        if (form_provincia.valid() ) {
            let formdata = new FormData(document.getElementById('form_provincia'));
            formdata.append('bandera', $('#filebandera')[0].files[0]);
            formdata.append('mapa', $('#filemapa')[0].files[0]);

            TML.ajax({
                url: urls.saveProvincia,
                data:  formdata,
                withFile: true,
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    ProvinciaManager.ajaxLoadProvincias();
                    $('#modal_provincia').modal('hide');
                    TML.showSuccess();
                }
            });

        } else {

            TML.showErrorValidacion()

        }

    },

    ajaxDeleteProvincia:function(id){
        TML.confirm(function () {
            TML.ajax({
                url: urls.deleteProvincia,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    $('#tr_provincia' + id).remove();
                    TML.showSuccess();
                }
            });
        });

    }


};