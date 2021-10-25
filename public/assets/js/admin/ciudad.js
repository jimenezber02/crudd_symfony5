var CiudadManager = {

    urls: null,

    init: function(urls){
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function() {
        $('[data-action="loadCiudad"]').off('click').on('click', function () {
            var id = $(this).data('id');
            CiudadManager.loadCiudad(id);
        });

        $('[data-action="saveCiudad"]').off('click').on('click', function () {
            CiudadManager.saveCiudad();
        });

        $('[data-action="enterFindCiudad"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
               CiudadManager.loadCiudades();

            }
        });
        $('[data-action="findCiudad"]').off('click').on('click', function () {
            CiudadManager.loadCiudades();
        });

        $('[data-action="deleteCiudad"]').off('click').on('click', function () {
            var id = $(this).data('id');
            CiudadManager.deleteCiudad(id);
        });
    },

    loadCiudad: function (id){
        TML.ajax({
            url: urls.loadCiudad,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_ciudades').modal('show');
                CiudadManager.initSelectProvincias();
                CiudadManager._initEvents();
            }
        });
    },

    loadCiudades: function (page= 1){
        var form_search_ciudad = $('#form_search_Ciudad');
        TML.ajax({
            url: urls.loadCiudades,
            data: form_search_ciudad.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                console.log(response);
                $('#container_ciudades').html(response);
                TableManager.initTable('#table_cities', CiudadManager.loadCiudades);
                CiudadManager._initEvents();
            }
        });
    },

    saveCiudad: function (){
        var form_ciudad = $('#form_ciudades');

        if(form_ciudad.valid()){
            TML.ajax({
                url: urls.saveCiudad,
                data: form_ciudad.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    CiudadManager.loadCiudades();
                    $('#modal_ciudades').modal('hide');
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    deleteCiudad: function (id){
        TML.confirm(function (){
            TML.ajax({
                url: urls.deleteCiudad,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#tr_ciudad'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },

    initSelectProvincias: function (campo) {
        FormFielsManager.initSelec2("#select_provincias",urls.selectProvincias,"Seleccione una provincia");
    },
}