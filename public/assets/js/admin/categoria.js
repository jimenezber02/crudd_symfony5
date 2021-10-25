var CategoriaManager = {

    urls: null,
    breadcrumbs: [],

    init: function (urls) {
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function () {

        $('[data-action="ajaxGetChildrens"]').off('click').on('click', function () {
            var id = $(this).data("id");
            var idpadre = $(this).data("idpadre");
            var tipocat = $(this).data("tipo");
            var nombre = $(this).data("nombre");


            if ($('#li' + id).length) {
                $('ol.breadcrumb').find('#li' + id).nextAll().remove();
            } else {
                $('ol.breadcrumb').append('<li id="li' + id + '" class="breadcrumb-item pe-3"><a href="#" class="pe-3" data-tipo="' + tipocat + '" data-id="' + id + '" data-idpadre="' + idpadre + '" data-nombre="' + nombre + '" data-action="ajaxGetChildrens">' + nombre + '</a></li>');
            }

            CategoriaManager.ajaxLoadCategorias(id, idpadre, 1, tipocat);

        });

        $('[data-action="ajaxAddCategoria"]').off('click').on('click', function () {

            CategoriaManager.ajaxLoadCategoria($(this).data("idpadre"), $(this).data("id"), $(this).data("tipo"));

        });

        $('[data-action="saveCategoria"]').off('click').on('click', function () {

            CategoriaManager.ajaxSaveCategoria($(this).data("id"), $(this).data("idpadre"), $(this).data("tipo"));
        });

        $('[data-action="ajaxLoadCategoria"]').off('click').on('click', function () {
            CategoriaManager.ajaxLoadCategoria($(this).data('idpadre'), $(this).data('id'), $(this).data("tipo"));

        });

        $('[data-action="ajaxDeleteCategoria"]').off('click').on('click', function () {
            CategoriaManager.ajaxDeleteCategoria($(this).data('id'), $(this).data("tipo"));

        });

        $('[data-action="findCategoria"]').off('click').on('click', function () {
            CategoriaManager.ajaxLoadCategorias("", "", 1, $(this).data("tipo"));
        });

        $('[data-action="cleanfindCategoria"]').off('click').on('click', function () {
            $('#form_search_categoria').trigger("reset");
            FormFielsManager.cleanCategoyTree('#select_category');
        });


        $('#cp-component').colorpicker();

        $('#cp-component').on('colorpickerChange', function (event) {
            $($('#cp-component').data("parent")).css("background-color", event.color.toString())
        });


    },

    ajaxLoadCategoryPagination: function (page) {
        CategoriaManager.ajaxLoadCategorias('', '', page, '');
    },

    //carga lista de organismos
    ajaxLoadCategorias: function (id = "", idpadre = "", page = 1, tipo = "") {

        if (id === '') {
            if ($('#idcatpagination')) {
                id = $('#idcatpagination').val();
                tipo = $('#tipopagination').val();
            }
        }

        var form_search_categoria = $('#form_search_categoria');
        TML.ajax({
            url: urls.ajaxLoadCategorias,
            data: form_search_categoria.serialize() + '&page=' + page + '&id=' + id + '&idpadre=' + idpadre + '&tipo=' + tipo,
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                $('#container_categorias').html(response);
                TableManager.initTable('#table_categoria', CategoriaManager.ajaxLoadCategoryPagination);
                CategoriaManager._initEvents();
            }
        });
    },

    //abro el modal para crear y tambien para editar ( el mismo modal)
    ajaxLoadCategoria: function (idpadre = "", id = "", tipo = "") {
        console.log(tipo);
        TML.ajax({
            url: urls.ajaxLoadCategoria,
            data: {id: id, idpadre: idpadre, tipo: tipo},
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                TML.fillModalContainer(response);
                $('#modal_categoria').modal('show');
                CategoriaManager._initEvents();
            }
        });

    },

    ajaxSaveCategoria: function (id = "", idpadre = "", tipo = "") {

        var form_categoria = $('#form_categoria');
        if (form_categoria.valid()) {
            TML.ajax({
                url: urls.ajaxSaveCategoria,
                data: form_categoria.serialize() + "&id=" + id + "&idpadre=" + idpadre + '&tipo=' + tipo,
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    CategoriaManager.ajaxLoadCategorias(idpadre, idpadre, 1, tipo);
                    $('#modal_categoria').modal('hide');
                    TML.showSuccess();
                }
            });
        } else {

            TML.showErrorValidacion()

        }
    },

    ajaxDeleteCategoria: function (id = "", tipo = 1) {
        TML.confirm(function () {
            TML.ajax({
                url: urls.ajaxDeleteCategoria,
                data: {
                    id: id,
                    tipo: tipo
                },
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    // CategoriaManager.ajaxLoadCategorias("","",1,tipo);
                    $('#tr_categoria' + id).remove();
                    TML.showSuccess();
                }
            });
        });

    },

}


