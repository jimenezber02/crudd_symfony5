var TramiteManager = {

    urls: null,
    idtramite: null,

    init: function(urls, idtramite = null){
        this.urls = urls;
        this.idtramite = idtramite;
        this._initEvents();
    },

    _initEvents: function()
    {
        //region Tramite

        $('[data-action="loadTramite"]').off('click').on('click', function () {
            var id = $(this).data('id');
            TramiteManager.loadTramite(id);
        });

        $('[data-action="saveTramite"]').off('click').on('click', function () {
            TramiteManager.saveTramite();
        });

        $('[data-action="deleteTramite"]').off('click').on('click', function () {
            var id = $(this).data('id');
            TramiteManager.deleteTramite(id);
        });

        $('[data-action="enterFindTramites"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                TramiteManager.loadTramites();
            }
        });

        $('[data-action="findTramites"]').off('click').on('click', function () {
            TramiteManager.loadTramites();
        });

        $('[data-action="checkAdmiteDependiente"]').off('change').on('change', function () {
            var checked = $(this).prop('checked');
            $('#container_dependientes').hide();
            if(checked){
                $('#container_dependientes').show();
            }
        });

        //endregion

        //region Gasto

        $('[data-action="loadGasto"]').off('click').on('click', function () {
            var idtramite = $(this).data('idtramite');
            var id = $(this).data('id');
            TramiteManager.loadGasto(id, idtramite);
        });

        $('[data-action="saveGasto"]').off('click').on('click', function () {
            TramiteManager.saveGasto();
        });

        $('[data-action="deleteGasto"]').off('click').on('click', function () {
            var id = $(this).data('id');
            TramiteManager.deleteGasto(id);
        });

        //endregion

        //region Formulario

        $('[data-action="loadFormularioTramite"]').off('click').on('click', function () {
            var idtramite = $(this).data('idtramite');
            var id = $(this).data('id');
            TramiteManager.loadFormularioTramite(id, idtramite);
        });

        $('[data-action="saveFormularioTramite"]').off('click').on('click', function () {
            TramiteManager.saveFormularioTramite();
        });

        $('[data-action="deleteFormularioTramite"]').off('click').on('click', function () {
            var id = $(this).data('id');
            TramiteManager.deleteFormularioTramite(id);
        });

        //endregion

        KTMenu.createInstances();
    },

    //region Tramite

    loadTramites: function (page= 1){
        var form_search = $('#form_search');
        TML.ajax({
            url: urls.loadTramites,
            data: form_search.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_tramites').html(response);
                TableManager.initTable('#container_tramites', TramiteManager.loadTramites);
                TramiteManager._initEvents();
            }
        });
    },

    loadTramite: function (id){
        TML.ajax({
            url: urls.loadTramite,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_tramite').modal('show');
                FormFielsManager.initDecimalFields();
                TramiteManager.initSelectDependiente();
                TramiteManager.initSelectCategoria();
                TramiteManager._initEvents();
            }
        });
    },

    saveTramite: function (){
        var form_tramite = $('#form_tramite');
        if(form_tramite.valid()){
            TML.ajax({
                url: urls.saveTramite,
                data: form_tramite.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#modal_tramite').modal('hide');
                    if(response.refreshdato == 1)
                    {
                        TramiteManager.refreshTramiteDatos(response.id);
                    }else{
                        TramiteManager.loadTramites();
                    }
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    deleteTramite: function (id){
        var form_confirm_delete_tramite = $('#form_confirm_delete_tramite');
        if(form_confirm_delete_tramite.valid()){
            TML.confirm(function (){
                TML.ajax({
                    url: urls.deleteTramite,
                    data: {
                        id: id
                    },
                    lockContainer: true,
                    checkResponse: true,
                    callback: function(response){
                        TML.showSuccess();
                        TML.redirectWithTimer(urls.tramites, 'Redirigiendo al listado de trámites...', 2000, true);
                    }
                });
            });
        }
    },

    initSelectCategoria: function (){
        FormFielsManager.initCategoyTree(urls.loadTreeCategory,'#category_tree_container', '#select_category', '#categorie_tree');
    },

    initSelectDependiente: function (){
        $('#select_dependientes').select2();
        $('#select_dependientes').on('select2:select', function (e) {
            var id = e.params.data.id;
            if(id === '1'){
                $('#select_dependientes').val([id]);
                $('#select_dependientes').trigger('change');
            }else{
                var ids =  $('#select_dependientes').val();
                var filters = ids.filter(function(value, index, arr){
                    return value != 1;
                });
                $('#select_dependientes').val(filters);
                $('#select_dependientes').trigger('change');
            }
        });
    },

    refreshTramiteDatos: function (id){
        TML.ajax({
            url: urls.refreshTramiteDatos,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#box_tramite').html(response);
                TramiteManager._initEvents();
            }
        });
    },

    //endregion

    //region Gasto

    loadGastos: function (page= 1){
        TML.ajax({
            url: urls.loadGastos,
            data:{
                idtramite: this.idtramite,
                page: page
            },
            lockContainer: true,
            callback: function(response){
                $('#container_gastos').html(response);
                TableManager.initTable('#container_gastos', TramiteManager.loadGastos);
                TramiteManager._initEvents();
            }
        });
    },

    loadGasto: function (id, idtramite){
        TML.ajax({
            url: urls.loadGasto,
            data: {
                id: id,
                idtramite: idtramite,
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_gasto').modal('show');
                FormFielsManager.initDecimalFields();
                TramiteManager.initSelectDependiente();
                TramiteManager._initEvents();
            }
        });
    },

    saveGasto: function (){
        var form_gasto = $('#form_gasto');
        if(form_gasto.valid()){
            TML.ajax({
                url: urls.saveGasto,
                data: form_gasto.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#modal_gasto').modal('hide');
                    TramiteManager.loadGastos();
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    deleteGasto: function (id){
        TML.confirm(function (){
            TML.ajax({
                url: urls.deleteGasto,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#tr_gasto'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },

    //endregion

    //region Formulario

    loadFormulariosTramite: function (page= 1){
        TML.ajax({
            url: urls.loadFormulariosTramite,
            data:{
                idtramite: this.idtramite,
                page: page
            },
            lockContainer: true,
            callback: function(response){
                $('#container_formularios').html(response);
                TableManager.initTable('#container_formularios', TramiteManager.loadFormulariosTramite);
                TramiteManager._initEvents();
            }
        });
    },

    loadFormularioTramite: function (id, idtramite){
        TML.ajax({
            url: urls.loadFormularioTramite,
            data: {
                id: id,
                idtramite: idtramite,
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_formulario').modal('show');
                FormFielsManager.initSelec2("#selectFormularios",urls.selectFormularios,"Seleccione un formulario");
                TramiteManager._initEvents();
            }
        });
    },

    saveFormularioTramite: function (){
        var form_formulario = $('#form_formulario');
        if(form_formulario.valid()){
            TML.ajax({
                url: urls.saveFormularioTramite,
                data: form_formulario.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#modal_formulario').modal('hide');
                    TramiteManager.loadFormulariosTramite();
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    deleteFormularioTramite: function (id){
        TML.confirm(function (){
            TML.ajax({
                url: urls.deleteFormularioTramite,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#tr_formulario'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },

    //endregion
}


