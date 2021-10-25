var FormularioManager = {

    idformulario: null,
    urls: null,
    callback: {
        create: null,
    },
    init: function(urls, idformulario = null){
        this.urls = urls;
        this.idformulario = idformulario;
        this._initEvents();
    },

    _initEvents: function(){
        //region Formulario
        $('[data-action="loadFormulario"]').off('click').on('click', function () {
            var id = $(this).data('id');
            FormularioManager.loadFormulario(id);
        });

        $('[data-action="saveFormulario"]').off('click').on('click', function () {
            FormularioManager.saveFormulario();
        });

        $('[data-action="deleteFormulario"]').off('click').on('click', function () {
            var id = $(this).data('id');
            FormularioManager.deleteFormulario(id);
        });

        $('[data-action="enterFindFormulario"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                FormularioManager.loadFormularios();
            }
        });

        $('[data-action="findFormulario"]').off('click').on('click', function () {
            FormularioManager.loadFormularios();
        });
        //endregion

        //region Formulario Area
        $('[data-action="loadFormularioArea"]').off('click').on('click', function () {
            var id = $(this).data('id');
            var idformulario = $(this).data('idformulario');
            FormularioManager.loadFormularioArea(id, idformulario);
        });

        $('[data-action="saveFormularioArea"]').off('click').on('click', function () {
            FormularioManager.saveFormularioArea();
        });

        $('[data-action="deleteFormularioArea"]').off('click').on('click', function () {
            var id = $(this).data('id');
            FormularioManager.deleteFormularioArea(id);
        });

        $('[data-action="enterFindFormularioArea"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                FormularioManager.loadFormularioAreas();
            }
        });

        $('[data-action="findFormularioAreas"]').off('click').on('click', function () {
            FormularioManager.loadFormularioAreas();
        });
        //endregion

        //region Formulario Row
        $('[data-action="loadFormularioRow"]').off('click').on('click', function () {
            var id = $(this).data('id');
            FormularioManager.loadFormularioRow(id);
        });

        $('[data-action="saveFormularioRow"]').off('click').on('click', function () {
            var idarea = $(this).data('idarea');
            FormularioManager.saveFormularioRow(idarea);
        });

        $('[data-action="deleteFormularioRow"]').off('click').on('click', function () {
            var id = $(this).data('id');
            FormularioManager.deleteFormularioRow(id);
        });

        $('[data-action="enterFindFormularioRow"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                FormularioManager.loadFormularioRows();
            }
        });

        $('[data-action="findFormularioRow"]').off('click').on('click', function () {
            FormularioManager.loadFormularioRows();
        });
        //endregion

        //region Formulario Campo
        $('[data-action="loadFormularioCampo"]').off('click').on('click', function () {
            var id = $(this).data('id');
            FormularioManager.loadFormularioCampo(id);
        });

        $('[data-action="saveFormularioCampo"]').off('click').on('click', function () {
            var idrow = $(this).data('idrow');
            FormularioManager.saveFormularioCampo(idrow);
        });

        $('[data-action="deleteFormularioCampo"]').off('click').on('click', function () {
            var id = $(this).data('id');
            var idcampo = $(this).data('idcampo');
            FormularioManager.deleteFormularioCampo(id, idcampo);
        });
        //endregion

        //region Campo
        $('[data-action="showFilter"]').off('click').on('click', function () {
            $('#container_filter').toggle(200);
        });

        $('[data-action="cleanfindCampo"]').off('click').on('click', function () {
            $('#form_search_campos').trigger("reset");
            FormFielsManager.cleanCategoyTree('#select_category');
        });

        $('[data-action="enterFindCampo"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                FormularioManager.loadListCampos();
            }
        });

        $('[data-action="findCambos"]').off('click').on('click', function () {
            FormularioManager.loadListCampos();
        });
        //endregion

        KTMenu.createInstances();
    },

    //region Formulario
    refreshFormularioDatos: function (id){
        TML.ajax({
            url: urls.refreshFormularioDatos,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#box_formulario').html(response);
                FormularioManager._initEvents();
            }
        });
    },

    loadFormularios: function (page= 1){
        var form_search = $('#form_search');
        TML.ajax({
            url: FormularioManager.urls.loadFormularios,
            data: form_search.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_formularios').html(response);
                TableManager.initTable('#list_formularios', FormularioManager.loadFormularios);
                FormularioManager._initEvents();
            }
        });
    },

    loadFormulario: function (id){
        TML.ajax({
            url: FormularioManager.urls.loadFormulario,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_formulario').modal('show');
                FormFielsManager.initLoadFile();
                FormularioManager._initEvents();
            }
        });
    },

    saveFormulario: function (){
        var form_formulario = $('#form_formulario');
        if(form_formulario.valid()){
            form_formulario = new FormData(document.getElementById("form_formulario"));
            TML.ajax({
                url: urls.saveFormulario,
                data: form_formulario,
                lockContainer: true,
                checkResponse: true,
                withFile: true,
                callback: function(response){
                    $('#modal_formulario').modal('hide');
                    if(response.refreshdato == 1)
                    {
                        FormularioManager.refreshFormularioDatos(response.id);
                    }else{
                        FormularioManager.loadFormularios();
                    }

                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    deleteFormulario: function (id){
        var form_confirm_delete_formulario = $('#form_confirm_delete_formulario');
        if(form_confirm_delete_formulario.valid()){
            TML.confirm(function (){
                TML.ajax({
                    url: FormularioManager.urls.deleteFormulario,
                    data: {
                        id: id
                    },
                    lockContainer: true,
                    checkResponse: true,
                    callback: function(response){
                        TML.showSuccess();
                        TML.redirectWithTimer(FormularioManager.urls.formularios, 'Redirigiendo al listado de formularios...', 2000, true);
                    }
                });
            });
        }
    },


    //endregion

    //region Formulario Area
    loadFormularioAreas: function (){
        TML.ajax({
            url: FormularioManager.urls.loadFormularioAreas,
            data:{
                idformulario: FormularioManager.idformulario
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_formularioareas').html(response);
                FormularioManager.initSortable('#container_formularioareas','.sortablesareas', FormularioManager.urls.saveOrderFormularioArea);
                $('.formularioareas').each(function (index,elemt) {
                    FormularioManager.loadFormularioRows($(elemt).data('id'));
                });

                FormularioManager._initEvents();
            }
        });
    },

    loadFormularioArea: function (id, idformulario){
        TML.ajax({
            url: FormularioManager.urls.loadFormularioArea,
            data: {
                id: id,
                idformulario: idformulario,
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_formularioarea').modal('show');
                FormularioManager._initEvents();
            }
        });
    },

    saveFormularioArea: function (){
        var form_formularioarea = $('#form_formularioarea');
        if(form_formularioarea.valid()){
            TML.ajax({
                url: FormularioManager.urls.saveFormularioArea,
                data: form_formularioarea.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#modal_formularioarea').modal('hide');
                    FormularioManager.loadFormularioAreas();
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    deleteFormularioArea: function (id){
        TML.confirm(function (){
            TML.ajax({
                url: FormularioManager.urls.deleteFormularioArea,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#formularioarea'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },

    //endregion

    //region Formulario Row
    loadFormularioRows: function (idarea){
        TML.ajax({
            url: FormularioManager.urls.loadFormularioRows,
            data: {
                idarea: idarea
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_formulariorows'+idarea).html(response);
                FormularioManager.initSortable('#container_formulariorows'+idarea,'.sortablesrows', FormularioManager.urls.saveOrderFormularioRow);
                $('#container_formulariorows'+idarea).find('.formulariorows').each(function (index,elemt) {
                    FormularioManager.loadFormularioCampos($(elemt).data('idrow'));
                });
                FormularioManager._initEvents();
                FormularioManager.initDroppableRows();
            }
        });
    },

    saveFormularioRow: function (idarea){
        TML.ajax({
            url: FormularioManager.urls.saveFormularioRow,
            data: {
                idarea: idarea
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                FormularioManager.loadFormularioRows(idarea);
            }
        });
    },

    deleteFormularioRow: function (id){
        TML.confirm(function (){
            TML.ajax({
                url: FormularioManager.urls.deleteFormularioRow,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#formulariorow'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },

    initDroppableRows: function(){
        $('.formulariorows').droppable({
            accept: ".campos",
            drop: function( event, ui ) {
                var idformulario = FormularioManager.idformulario;
                var idarea = $(this).data('idarea');
                var idrow = $(this).data('idrow');
                var idcampo = ui.draggable.data('idcampo');
                $('#campo'+idcampo).hide();
                FormularioManager.joinFormularioCampo(idformulario, idarea, idrow, idcampo);
            }
        });
    },

    //endregion

    //region Formulario Campo

    loadFormularioCampos: function (idrow){
        TML.ajax({
            url: FormularioManager.urls.loadFormularioCampos,
            data:{
                idrow: idrow
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_formulariocampos'+idrow).html(response);
                FormularioManager.initSortable('#container_formulariocampos'+idrow,'.sortablescampos', FormularioManager.urls.saveOrderFormularioCampo);
                FormularioManager._initEvents();
            }
        });
    },

    loadFormularioCampo: function (id){
        TML.ajax({
            url: FormularioManager.urls.loadFormularioCampo,
            data: {
                id: id,
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_formulariocampo').modal('show');
                FormularioManager._initEvents();
            }
        });
    },

    saveFormularioCampo: function (idrow){
        var form_formulariocampo = $('#form_formulariocampo');
        if(form_formulariocampo.valid()){
            TML.ajax({
                url: FormularioManager.urls.saveFormularioCampo,
                data: form_formulariocampo.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#modal_formulariocampo').modal('hide');
                    FormularioManager.loadFormularioCampos(idrow);
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    deleteFormularioCampo: function (id, idcampo){
        TML.confirm(function (){
            TML.ajax({
                url: FormularioManager.urls.deleteFormularioCampo,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#formulariocampo'+id).remove();
                    $('#campo'+idcampo).show();
                    TML.showSuccess();
                }
            });
        });
    },

    joinFormularioCampo: function (idformulario, idarea, idrow, idcampo, accion = 'add'){
        TML.ajax({
            url: FormularioManager.urls.joinFormularioCampo,
            data: {
                idformulario: idformulario,
                idarea: idarea,
                idrow: idrow,
                idcampo: idcampo,
                accion: accion
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                if(accion){
                    FormularioManager.loadFormularioCampos(idrow);
                    FormularioManager.loadFormularioCampo(response);
                }
            }
        });
    },

    //endregion

    //region Campo
    loadListCampos: function (){
        var form_search_campos = $('#form_search_campos');
        TML.ajax({
            url: FormularioManager.urls.loadListCampos,
            data: form_search_campos.serialize(),
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_campos').html(response);
                FormularioManager._initEvents();
                FormularioManager.initDraggableCampos();
            }
        });
    },

    initDraggableCampos: function (){
        $('.campos').draggable({
            revert: true,
        });
    },
    //endregion

    initSortable: function (target,targetids, urlsortable){
        $(target).sortable({
            stop: function( event, ui ) {
                var ids = [];
                $(targetids).each(function (index,elemt) {
                    ids.push($(elemt).data('sortable_id'));
                });
                TML.ajax({
                    url: urlsortable,
                    data: {
                        ids: ids
                    },
                    lockContainer: false,
                    checkResponse: true,
                    callback: function(response){

                    }
                });
            }
        });
        $(target).disableSelection();
    }
}


