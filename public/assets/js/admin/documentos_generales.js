var Documentos_generalesManager = {

    urls: null,
    breadcrumbs: [],

    init: function (urls) {
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function ()
    {
        $('[data-action="ajaxAddDocumentosGenerales"]').off('click').on('click', function () {
            Documentos_generalesManager.ajaxLoadDocumento($(this).data("id"), $(this).data("tipo"));
        });

        $('[data-action="saveDocumento"]').off('click').on('click', function () {

            Documentos_generalesManager.ajaxSaveDocumento($(this).data("id"), $(this).data("tipo"));
        });

        $('[data-action="ajaxDeleteDocumentosGenerales"]').off('click').on('click', function () {
            Documentos_generalesManager.ajaxDeleteDocumento($(this).data('id'), $(this).data("tipo"));
        });

        $('[data-action="findDocumentos_generales"]').off('click').on('click', function () {
            Documentos_generalesManager.ajaxLoadDocumentosGenerales("", 1, $(this).data("tipo"));
        });
        $('[data-action="enterFinddocumentosGenerales"]').off('keyup').on('keyup', function (e) {
            if(e.keyCode == 13){
                Documentos_generalesManager.ajaxLoadDocumentosGenerales("", 1, $(this).data("tipo"));
            }
        });

    },

    ajaxLoadDocumentPagination: function(page)
    {
        Documentos_generalesManager.ajaxLoadDocumentosGenerales('','',page,'');
    },

    //carga lista de documentos
    ajaxLoadDocumentosGenerales: function (id = "", page = 1, tipo = "") {
        if (id === '') {
            if ($('#idcatpagination')) {
                id = $('#idcatpagination').val();
                tipo = $('#tipopagination').val();
            }
        }
        var form_search_documentos = $('#form_search_documentosGenerales');
        TML.ajax({
            url: urls.ajaxLoadDocumentosGenerales,
            data: form_search_documentos.serialize() + '&page=' + page + '&id=' + id  + '&tipo=' + tipo,
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                $('#container_documentosGenerales').html(response);
                TableManager.initTable('#table_documentosGenerales', Documentos_generalesManager.ajaxLoadDocumentPagination);
                Documentos_generalesManager._initEvents();
            }
        });
    },

    //abro el modal para crear y tambien para editar ( el mismo modal)
    ajaxLoadDocumento: function (id = "", tipo = "") {
        TML.ajax({
            url: urls.ajaxLoadDocumento,
            data: {id: id, tipo: tipo},
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                TML.fillModalContainer(response);
                $('#modal_documentosGenerales').modal('show');
                Documentos_generalesManager._initEvents();
            }
        });

    },

    ajaxSaveDocumento: function (id = "", tipo = "") {
        var form_documento = $('#form_documentosGenerales');
        form_documento.validate({
            rules: {
                documento: {
                    required: true,
                    url: true
                }
            }
        });
        if (form_documento.valid()) {
            TML.ajax({
                url: urls.ajaxSaveDocumento,
                data: form_documento.serialize() + "&id=" + id + '&tipo=' + tipo,
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    Documentos_generalesManager.ajaxLoadDocumentosGenerales('', 1, tipo);
                    $('#modal_documentosGenerales').modal('hide');
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    ajaxDeleteDocumento: function (id = "", tipo = "") {
        TML.confirm(function () {
            TML.ajax({
                url: urls.ajaxDeleteDocumento,
                data: {
                    id: id,
                    tipo: tipo
                },
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    // CategoriaManager.ajaxLoadCategorias("","",1,tipo);
                    $('#tr_documentos_generales' + id).remove();
                    TML.showSuccess();
                }
            });
        });

    },

}


