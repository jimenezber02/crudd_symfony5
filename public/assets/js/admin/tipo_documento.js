var TipoDocumentoManager = {

    urls: null,

    init: function(urls){
        this.urls = urls;
        this._initEvents();

    },
    _initEvents: function(){
        $('[data-action="ajaxAddTipoDocumento"]').off('click').on('click', function () {
            TipoDocumentoManager.ajaxLoadTipoDocumento();

        });
        $('[data-action="ajaxLoadTipoDocumento"]').off('click').on('click', function () {
            TipoDocumentoManager.ajaxLoadTipoDocumento($(this).data("id"));

        });
        $('[data-action="saveTipoDocumento"]').off('click').on('click', function () {

            TipoDocumentoManager.ajaxSaveTipoDocumento();
        });
        $('[data-action="findTipoDocumento"]').off('click').on('click', function () {
            TipoDocumentoManager.ajaxLoadTipoDocumentos(1,false);

        });
        $('[data-action="ajaxDeleteTipoDocumento"]').off('click').on('click', function () {
            TipoDocumentoManager.ajaxDeleteTipoDocumento($(this).data('id'));

        });

        $('[data-action="copyTipoDocumento"]').off('click').on('click', function () {
            var id = $(this).data('id');
            TipoDocumentoManager.copyTipoDocumento(id);

        });

        //region Validaciones

        $('[data-action="loadValidacionesTipoDocumento"]').off('click').on('click', function () {
            var id = $(this).data('id');
            TipoDocumentoManager.initSelect2Validaciones();
            TipoDocumentoManager.loadValidacionesTipoDocumento(id);
        });

        $('[data-action="saveValidacionesTipoDocumento"]').off('click').on('click', function () {
            var idtipodocumento = $(this).data('idtipodocumento');
            var idvalidacion = $('#select_validaciones').val();
            TipoDocumentoManager.saveValidacionesTipoDocumento(idtipodocumento, idvalidacion);
        });

        $('[data-action="deleteValidacionesTipoDocumento"]').off('click').on('click', function () {
            var idtipodocumento = $(this).data('idtipodocumento');
            var idvalidacion = $(this).data('idvalidacion');
            TipoDocumentoManager.deleteValidacionesTipoDocumento(idtipodocumento, idvalidacion);
        });

        $('[data-action="loadValidacionTipoDocumento"]').off('click').on('click', function () {
            var idtipodocumento = $(this).data('idtipodocumento');
            TipoDocumentoManager.loadValidacionTipoDocumento(idtipodocumento);
        });

        //endregion

    },

    //carga lista de tipos de documentos
    ajaxLoadTipoDocumentos: function (page = 1,reload= true){
        var form_search_tipo_documento = $('#form_search_tipo_documento');
        TML.ajax({
            url: urls.ajaxLoadTipoDocumentos,
            data: form_search_tipo_documento.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_tipo_documento').html(response);
                TableManager.initTable('#table_tipo_documento', TipoDocumentoManager.ajaxLoadTipoDocumentos);
                if(reload){
                    FormFielsManager.initSelec2("#categoriaFiltres","/Administracion/ajaxSearchTipoDocumentoSelect2","Categoria")
                }
                TipoDocumentoManager._initEvents();
            }
        });
    },

    //abro el modal para crear y tambien para editar ( el mismo modal)
    ajaxLoadTipoDocumento:function(id){
        console.log(id)
        TML.ajax({
            url: urls.ajaxLoadTipoDocumento,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){

                TML.fillModalContainer(response);
                $('#modal_tipo_documento').modal('show');
                $('#modal_tipo_documento').on('shown.bs.modal', function (e) {
                    // do something...
                    FormFielsManager.initSelec2("#searchCategoria","/Administracion/ajaxSearchTipoDocumentoSelect2","Seleccione")

                })
                TipoDocumentoManager._initEvents();
            },
        });




    },

    //save
    ajaxSaveTipoDocumento:function(){
        var form_tipo_documento = $('#form_tipo_documento');
        if(form_tipo_documento.valid()){
            TML.ajax({
                url: urls.ajaxSaveTipoDocumento,
                data: form_tipo_documento.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    TipoDocumentoManager.ajaxLoadTipoDocumentos();
                    $('#modal_tipo_documento').modal('hide');
                    TML.showSuccess();
                }
            });
        }else {

            TML.showErrorValidacion()

        }

    },

    //delete
    ajaxDeleteTipoDocumento:function(id=""){
        TML.confirm(function (){
            TML.ajax({
                url: urls.ajaxDeleteTipoDocumento,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    TipoDocumentoManager.ajaxLoadTipoDocumentos();
                    TML.showSuccess();
                }
            });
        });
    },

    copyTipoDocumento:function(id){
        TML.ajax({
            url: urls.copyTipoDocumento,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TipoDocumentoManager.ajaxLoadTipoDocumentos();
                TML.showSuccess();
            }
        });
    },

    //region Validaciones

    initSelect2Validaciones: function (){
        FormFielsManager.initSelec2("#select_validaciones",urls.selectValidacionesTipoDocumento,"Valoraciones");
    },

    loadValidacionTipoDocumento:function(idtipodocumento){
        ValidacionManager.loadValidacion();
        ValidacionManager.callback.create = function (idvalidacion){
            TipoDocumentoManager.saveValidacionesTipoDocumento(idtipodocumento, idvalidacion);
        };
    },

    loadValidacionesTipoDocumento:function(id){
        TML.ajax({
            url: urls.loadValidacionesTipoDocumento,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_validaciones').html(response);
                TipoDocumentoManager._initEvents();
            }
        });
    },

    saveValidacionesTipoDocumento:function(idtipodocumento, idvalidacion){
        TML.ajax({
            url: urls.saveValidacionesTipoDocumento,
            data: {
                idtipodocumento: idtipodocumento,
                idvalidacion: idvalidacion
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TipoDocumentoManager.loadValidacionesTipoDocumento(idtipodocumento);
            }
        });
    },

    deleteValidacionesTipoDocumento:function(idtipodocumento, idvalidacion){
        TML.confirm(function (){
            TML.ajax({
                url: urls.deleteValidacionesTipoDocumento,
                data: {
                    idtipodocumento: idtipodocumento,
                    idvalidacion: idvalidacion
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#tr_validaciontipodocumento'+idvalidacion).remove();
                }
            });
        });
    },

    //endregion
}