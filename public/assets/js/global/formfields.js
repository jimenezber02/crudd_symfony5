var FormFielsManager = {

    //region datetime picker, el time es opcional
    dateTimePick: function (target, isTimePicke = false, defaultDate = new Date()) {
        /// console.log(defaultDate)
        if($(target).data('default')){
            defaultDate = $(target).data('default');
        }
        $(target).daterangepicker({
                singleDatePicker: true,
                timePicker: isTimePicke,
                showDropdowns: true,
                minYear: 1901,
                maxYear: new Date().getFullYear() + 5,
                startDate: defaultDate,
                locale: {
                    format: "DD-MM-Y",
                    applyLabel: "Aplicar",
                    cancelLabel: "Cancelar",
                    customRangeLabel: "Custom",
                    daysOfWeek: [
                        "Dom",
                        "Lun",
                        "Mar",
                        "Mie",
                        "Jue",
                        "Vie",
                        "Sáb"
                    ],
                    monthNames: [
                        "Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre"
                    ],
                    firstDay: 1
                },
            },
        );

    },
    // endregion

    //region Imagen
    initLoadImagen: function () {
        $('[data-action="loadPreviewImage"]').off("click").on('click', function () {
            $(this).find('input').trigger('change');
        });
        $('.file').off("change").on('change', function () {
            var file = $(this).get(0).files[0];
            var container = $(this).parent().parent();
            if (file) {
                var reader = new FileReader();
                reader.onload = function () {
                    console.log('aaa');
                    $(container).find('.preview_imagen').prop('src', reader.result);
                }
                reader.readAsDataURL(file);
            }
        });
    },
    //endregion

    //region File
    initLoadFile: function () {
        $('[data-action="loadFileInfo"]').off("click").on('click', function () {
            $(this).parent().find('input').trigger('click');
        });
        $('.file').off("change").on('change', function () {
            console.log($(this).get(0).files[0]);
            var file = $(this).get(0).files[0];
            var fileName = file.name;
            var fileSize = file.size;

            $(this).parent().find('#span_fileinfo').html(fileName);
        });
        KTApp.initBootstrapTooltips();
    },
    //endregion

    //region Select2
    initSelec2: function (target, url, placeholder = '', parameters = [], perpage = 10) {
        $(target).select2({
            placeholder: placeholder,
            allowClear: true,
            ajax: {
                url: url,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        search: params.term, // search term
                        page: params.page,
                        parameters: parameters,
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    var transformed = data.results.map(function (d) {
                        return {
                            id: d.id,
                            text: d.text
                        }
                    });
                    return {
                        results: transformed,
                        pagination: {
                            more: (params.page * perpage) < data.count
                        }
                    };
                },
                cache: true
            },
        });

        if ($(target).data("idselect") !== "" && $(target).data("textselect") !== "") {
            $(target).append(new Option($(target).data("textselect"), $(target).data("idselect"), true, true)).trigger('change');
        }


    },
    cleanSelec2: function (target) {
        $(target).val(null).trigger('change');
    },
    //endregion

    //region category tree
    initCategoyTree: function (url, targetcontainer, targetselect, targettree, placeholder = '', tipo = '') {
        var container = targetcontainer;
        $('#select2-' + targetselect.replace('.', '').replace('#', '') + '-results', container).parent().parent().parent().hide();
        var select2 = $(targetselect);
        var categorie_tree = $(targettree);

        var tipo = select2.data('tipo');

        select2.select2({
            placeholder: placeholder,
        }).on("change", function () {
            //$('#product_categoryDefaultId').val(select2.val());
        });
        select2.on('select2:opening', function (e) {
            e.preventDefault();
            $('.category_tree', container).show();
            $('#btn_categorie_tree', container).off('click').on('click', function (e) {
                $('.category_tree', container).hide();
            });

            categorie_tree.jstree(true).refresh();
        });
        select2.on('select2:unselecting', function (e) {
            var id = e.params.args.data.id;
            categorie_tree.jstree("uncheck_node", id);
        });

        categorie_tree.jstree({
            core: {
                themes: {
                    responsive: false
                },
                rules: {
                    multiple: false
                },
                data: {
                    url: function (node) {
                        return url;
                    },
                    data: function (node) {
                        return {
                            ids: [node.id],
                            tipo: tipo,
                        };
                    }
                },
                check_callback: function (operation, node, node_parent, node_position, more) {
                    if (operation === 'move_node') {
                        if (node.original.isroot == 1 || node.original.idparent == 0 || node.original.idparent == '#') {
                            return false;
                        }
                    }
                    return true;
                }
            },
            search: {
                show_only_matches: true,
                skip_async: true,
                case_sensitive: false
            },
            checkbox: {
                three_state: false,
                whole_node: false,
                tie_selection: false
            },
            plugins: ["wholerow", "types", "search", "dnd"],
            types: {
                activa_hijos: {
                    icon: "fa fa-tags kt-font-success"
                },
                activa_sin_hijos: {
                    icon: "fa fa-tag kt-font-success"
                },
                desactivada_hijos: {
                    icon: "fa fa-tags kt-font-warning"
                },
                desactivada_sin_hijos: {
                    icon: "fa fa-tag kt-font-warning"
                }
            },
        });
        categorie_tree.on('select_node.jstree', function (node, selected, event) {
            console.log('selec_node');
            var id = selected.node.id;
            if(id != select2.val()){
                $('.category_tree', container).hide();
            }
            var id = selected.node.id;
            var nombre = selected.node.text;
            var option = new Option(nombre, id, false, true);
            select2.append(option).trigger('change');

        });
        categorie_tree.on('uncheck_node.jstree', function (node, selected, event) {
            var id = selected.node.id;
            //TODO remove options
        });
        categorie_tree.on('redraw.jstree', function (nodes) {
            //selecciono el
            var id = select2.val();
            categorie_tree.jstree(true).select_node(id);
        });


    },
    cleanCategoyTree: function (target) {
        $(target).val(null).trigger('change');
    },
    //endregion

    //region editor de texto
    initTinymce: function (target, options = null){
        tinymce.remove();
        var options = {selector: target};
        if (KTApp.isDarkMode()) {
            options["skin"] = "oxide-dark";
            options["content_css"] = "dark";
        }
        tinymce.init(options);

    },
    //endregion

    //region campos numericos
    initDecimalFields: function () {
        $('.decimal_field').on('input', function () {
            this.value = this.value.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
        });
    },
    //endregion

};

jQuery.extend(jQuery.validator.messages, {
    required: 'Este campo es obligatorio.',//"This field is required.",
    url: 'Introduzca una url válida.',//"This field is required.",
    email: 'Introduzca una dirección de correo válida.',//"Please enter a valid email address.",
    equalTo:'Las contraseña deben coincidir.', // Please enter the same value again.
    emailTaken:'Este email ya existe.',
    maxlength: jQuery.validator.format("Por favor no escriba mas de {0} caracteres."), //"Please enter no more than {0} characters."
    minlength: jQuery.validator.format("Por favor escriba al menos {0} carácter"),//jQuery.validator.format("Please enter at least {0} characters."),
    max: jQuery.validator.format("Por favor escriba un valor menor o igual a {0}."),//jQuery.validator.format("Please enter a value less than or equal to {0}."),
    min: jQuery.validator.format("Por favor escriba un valor mayor o igual a {0}.")//jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});
