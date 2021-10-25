var RepositorioJuridicoManager = {

    urls: null,
    idrep_juridico: null,
    checked: [],
    init: function (urls, idrep_juridico = null) {
        this.urls = urls;
        this.idrep_juridico = idrep_juridico;
        this._initEvents();
    },

    _initEvents: function () {
        //agregando desde la pantalla principal
        $('[data-action="ajaxAddRepositorioJuridico"]').off('click').on('click', function () {
            RepositorioJuridicoManager.ajaxAddAfectaRepositorioJuridico("", "", $(this).data('section'));

        });

        //agregar afecta a
        $('[data-action="ajaxAddAfectaRepositorioJuridico"]').off('click').on('click', function () {

            RepositorioJuridicoManager.ajaxAddAfectaRepositorioJuridico($(this).data('id'), $(this).data('repjuridico'), $(this).data('section'));

        });

        $('[data-action="ajaxSaveRepositorioJuridico"]').off('click').on('click', function () {

            RepositorioJuridicoManager.ajaxSaveRepositorioJuridico($(this).data('id'), $(this).data('section'), $(this).data('repjuridico'));
        });

        $('[data-action="findRepositorioJuridico"]').off('click').on('click', function () {
            RepositorioJuridicoManager.ajaxLoadRepositorioJuridicos(1, false, true);
        });

        $('[data-action="enterfindRepositorioJuridico"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                RepositorioJuridicoManager.ajaxLoadRepositorioJuridicos(1, false, true);

            }
        });

        $('[data-action="ajaxLoadRepositorioJuridico"]').off('click').on('click', function () {
            RepositorioJuridicoManager.ajaxAddRepositorioJuridico($(this).data('id'), $(this).data('section'));
        });

        $('[data-action="ajaxDeleteRepositorioJuridico"]').off('click').on('click', function () {
            RepositorioJuridicoManager.ajaxDeleteRepositorioJuridico($(this).data('id'), $(this).data('target'), $(this).data('section'));
        });

        //consultar y agregr rep existentes
        $('[data-action="ajaxAddAfectaExistentesRepositorioJuridico"]').off('click').on('click', function () {
            RepositorioJuridicoManager.ajaxAddAfectaExistentesRepositorioJuridico($(this).data('id'), $(this).data('repjuridico'), $(this).data('section'));
        });

        //agregar desde el consultar y agregar
        $('[data-action="ajaxSaveRepositorioJuridicoBySearch"]').off('click').on('click', function () {

            RepositorioJuridicoManager.ajaxSaveRepositorioJuridicoBySearch($(this).data('repjuridico'), $(this).data('section'));
        });

        //consultar repositorio

        $('[data-action="enterfindSearchModalRepositorioJuridico"]').off('keydown').on('keydown', function (e) {

            if (e.keyCode == 13) {
                e.preventDefault();
            }
            //return false;
            //checo los que han seleccionado
            RepositorioJuridicoManager.setCheckedAndSelected();

            //envio a consultar con los check seleccioandos
            TML.ajax({
                url: urls.ajaxSearchInModalRepositorioJuridico,
                data: {
                    search: $(this).val(),
                    checked: RepositorioJuridicoManager.checked,
                    section: $(this).data('section'),
                    repjuridico: $(this).data('repjuridico')
                },
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    $('#section-table_repositorio_juridico_existentes').html(response);

                },
            });


        });
    },

    //carga lista
    ajaxLoadRepositorioJuridicos: function (page = 1, reload = true, formSearch = false) {

        var form_search_repositorio_juridico = $('#form_search_repositorio_juridico');
        TML.ajax({
            url: urls.ajaxLoadRepositorioJuridicos,
            data: form_search_repositorio_juridico.serialize() + '&page=' + page + '&formSearch=' + formSearch,
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                $('#container_repositorio_juridico').html(response);
                TableManager.initTable('#table_repositorio_juridico', RepositorioJuridicoManager.ajaxLoadRepositorioJuridicos);
                if (reload) {
                    FormFielsManager.initSelec2("#categoriaFiltres", "/Administracion/ajaxLoadAllCategoriasRepJuridicoSelect2", "Categoria")
                }
                RepositorioJuridicoManager._initEvents();
            }
        });
    },
    //abro el modal para crear y tambien para editar ( el mismo modal)
    ajaxAddAfectaRepositorioJuridico: function (id, repjuridico = "", section = "") {

        TML.ajax({
            url: urls.ajaxLoadRepositorioJuridico,
            data: {
                id: id,
                section: section,
                repjuridico: repjuridico
            },
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {

                TML.fillModalContainer(response);
                $('#modal_repositorio_juridico').modal('show');
                RepositorioJuridicoManager.initSelectCategoria();
                FormFielsManager.dateTimePick('#fecha_repositorio_juridico', false);
                RepositorioJuridicoManager._initEvents();
            },
        });

    },
    initSelectCategoria: function () {
        FormFielsManager.initCategoyTree(urls.ajaxLoadTreeCategoryRepositorioJuridico, '#category_tree_container_modal', '#categoria_modal', '#categorie_tree_modal');

    },
    ajaxSaveRepositorioJuridico: function (id = "", section = "", repjuridico = "") {

        let form_repositorio_juridico = new FormData(document.getElementById("form_repositorio_juridico"));
        var blob = $('input[type=file]')[0].files[0];
        form_repositorio_juridico.append('file', blob);
        form_repositorio_juridico.append('rep_juridico', repjuridico);
        form_repositorio_juridico.append('section', section);
        if ($('#form_repositorio_juridico').valid()) {
            TML.ajax({
                url: urls.ajaxSaveRepositorioJuridico,
                data: form_repositorio_juridico,
                lockContainer: true,
                withFile: true,
                checkResponse: true,
                callback: function (response) {
                    switch (section) {
                        case 1:
                            RepositorioJuridicoManager.ajaxLoadRepositorioJuridicos();
                            break;

                        case 2:
                            RepositorioJuridicoManager.refreshRepositorioJuridico(id);
                            break;

                        case 3:
                            RepositorioJuridicoManager.refreshAfectacionesRepositorioJuridico(1, repjuridico, section, '#table_repositorio_juridico_afecta');
                            break;

                        case 4:
                            RepositorioJuridicoManager.refreshAfectacionesRepositorioJuridico(1, repjuridico, section, '#table_repositorio_juridico_afectado');
                            break;

                        default:
                            RepositorioJuridicoManager.ajaxLoadRepositorioJuridicos();
                            break;


                    }

                    $('#modal_repositorio_juridico').modal('hide');
                    TML.showSuccess();
                }
            });
        } else {

            TML.showErrorValidacion()

        }

    },
    ajaxDeleteRepositorioJuridico: function (id, target, section) {
        var pass = true;
        if (section == 2) {

            pass = $('#footerDeleteRepositorioJuridico').valid();
        }
        if (pass) {
            TML.confirm(function () {
                TML.ajax({
                    url: urls.ajaxDeleteRepositorioJuridico,
                    data: {
                        id: id,
                        section: section
                    },
                    lockContainer: true,
                    checkResponse: true,
                    callback: function (response) {
                        //console.log(response)
                        if (section == 2) {

                            TML.redirectWithTimer(urls.homeRepositorioJuridico, 'Redirigiendo al listado de repositorio jurídico...', 2000, true);
                        } else {
                            $('#' + target + id).remove();
                        }
                        TML.showSuccess();
                    }
                });
            });

        } else {

            TML.showErrorValidacion()

        }


    },
    refreshRepositorioJuridico: function (id) {

        TML.ajax({
            url: urls.refreshRepositorioJuridico,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {

                $('#box_repositorio_juridico').html(response);
                RepositorioJuridicoManager.refreshAfectacionesRepositorioJuridico(1, id, 3, '#table_repositorio_juridico_afecta')
                RepositorioJuridicoManager.refreshAfectacionesRepositorioJuridico(1, id, 4, '#table_repositorio_juridico_afectado')
                RepositorioJuridicoManager._initEvents();


            }


        });


    },
    refreshAfectacionesRepositorioJuridico: function (page = 1, repjuridico, section, target) {

        TML.ajax({
            url: urls.ajaxRefreshAfectacionesRepositorioJuridicoDatos,
            data: {
                id: repjuridico,
                section: section,
                page: page
            },
            checkResponse: true,
            callback: function (response) {
                $('#box_repositorio_juridico-section' + section).html(response);
                TableManager.initTable(target, RepositorioJuridicoManager.refreshAfectacionesRepositorioJuridico, {
                    id: repjuridico,
                    section: section
                })
                RepositorioJuridicoManager._initEvents();

            }
        });
    },

    ajaxAddAfectaExistentesRepositorioJuridico(id, repjuridico = "", section = "") {
        TML.ajax({
            url: urls.ajaxAddAfectaExistentesRepositorioJuridico,
            data: {
                id: id,
                section: section,
                repjuridico: repjuridico
            },
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {

                TML.fillModalContainer(response);
                $('#modal_repositorio_juridico_buscar_y_agregar').modal('show');
                RepositorioJuridicoManager.checked = [];
                RepositorioJuridicoManager._initEvents();

            },
        });

    },

    ajaxSaveRepositorioJuridicoBySearch(repjuridico = "", section = "") {

        RepositorioJuridicoManager.setCheckedAndSelected();
        console.log(RepositorioJuridicoManager.checked)
        TML.ajax({
            url: urls.ajaxSaveRepositorioJuridicoBySearch,
            data: {
                section: section,
                repjuridico: repjuridico,
                checked: RepositorioJuridicoManager.checked
            },
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {

                switch (section) {
                    case 3:
                        RepositorioJuridicoManager.refreshAfectacionesRepositorioJuridico(1, repjuridico, section, '#table_repositorio_juridico_afecta');
                        break;

                    case 4:
                        RepositorioJuridicoManager.refreshAfectacionesRepositorioJuridico(1, repjuridico, section, '#table_repositorio_juridico_afectado');
                        break;

                }

                $('#modal_repositorio_juridico_buscar_y_agregar').modal('hide');

            },
        });
    },

    setCheckedAndSelected() {
        $('table#table_repositorio_juridico_existentes input[type="checkbox"]:checked').each(function () {
            if (!RepositorioJuridicoManager.checked.includes($(this).val())) {
                RepositorioJuridicoManager.checked.push($(this).val());
            }

        });
    }

};