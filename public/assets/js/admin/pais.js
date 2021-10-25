var PaisManager = {

    urls: null,

    init: function (urls) {
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function () {
        $('[data-action="ajaxAddPais"]').off('click').on('click', function () {
            PaisManager.ajaxLoadPais();

        });
        $('[data-action="savePais"]').on('click', function () {
            PaisManager.savePais();
        });
        $('[data-action="findPais"]').off('click').on('click', function () {
            PaisManager.ajaxLoadPaises(1,true);
        });

        $('[data-action="cleanfindPais"]').off('click').on('click', function () {
            $('#form_search_pais').trigger("reset");
        });

        $('[data-action="ajaxLoadPais"]').off('click').on('click', function () {
            PaisManager.ajaxLoadPais($(this).data('id'));

        });
        $('[data-action="ajaxDeletePais"]').on('click', function () {
            PaisManager.ajaxDeletePais($(this).data('id'));
        });
        $('[data-action="enterFindPais"]').off('keyup').on('keyup', function (e){
            if (e.keyCode == 13) {
                PaisManager.ajaxLoadPaises(1,true);
            }
        });

    },

    //carga lista de paises
    ajaxLoadPaises: function (page = 1){
        var form_search_pais = $('#form_search_pais');
        TML.ajax({
            url: urls.ajaxLoadPaises,
            data: form_search_pais.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                $('#container_paises').html(response);
                TableManager.initTable('#table_pais', PaisManager.ajaxLoadPaises);
                PaisManager._initEvents();
            }
        });
    },

    //abro el modal para crear y tambien para editar ( el mismo modal)
    ajaxLoadPais: function (id="") {
        TML.ajax({
            url: urls.ajaxLoadPais,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                TML.fillModalContainer(response);
                $('#modal_pais').modal('show');
                FormFielsManager.initDecimalFields();
                PaisManager._initEvents();
            }
        });

    },

    savePais: function () {
        var form_pais = $('#form_pais');


        if (form_pais.valid() ) {

            TML.ajax({
                url: urls.ajaxSavePais,
                data:  form_pais.serialize(),
                method: 'post',
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    PaisManager.ajaxLoadPaises();
                    $('#modal_pais').modal('hide');
                    TML.showSuccess();
                }
            });

        } else {

            TML.showErrorValidacion()

        }

    },

    ajaxDeletePais: function (id) {
        TML.confirm(function () {
            TML.ajax({
                url: urls.ajaxDeletePais,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    $('#tr_pais' + id).remove();
                    TML.showSuccess();
                }
            });
        });

    },
};