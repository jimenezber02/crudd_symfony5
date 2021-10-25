var OrganismosManager = {

    urls: null,

    init: function (urls) {
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function () {
        $('[data-action="ajaxAddOrganismo"]').off('click').on('click', function () {
            OrganismosManager.ajaxLoadOrganismo();

        });
        $('[data-action="ajaxLoadOrganismo"]').off('click').on('click', function () {
            OrganismosManager.ajaxLoadOrganismo($(this).data('id'));

        });

        $('[data-action="addFieldUrlOrganismo"]').off('click').on('click', function () {
            OrganismosManager.addFieldUrlOrganismo();
        });

        $('#tr-urls-organismo').on('click', '.field_remove', function () {
            const Instance = this;

            TML.confirm(function () {
                $(Instance).closest("tr").remove();
            });
        });

        $('[data-action="enterFindOrganismo"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                OrganismosManager.ajaxLoadOrganismos();
            }
        });


        $('[data-action="saveOrganismo"]').on('click', function () {
            OrganismosManager.saveOrganismo();
        });

        $('[data-action="ajaxDeleteOrganismo"]').on('click', function () {
            OrganismosManager.ajaxDeleteOrganismo($(this).data('id'));
        });

        $('[data-action="findOrganismo"]').off('click').on('click', function () {
            OrganismosManager.ajaxLoadOrganismos();
        });

        $('[data-action="loadContactos"]').off('click').on('click', function () {
            ContactoManager.loadContactos();
        });

        $('#tr-urls-organismo').on('change', '.checkurl', function () {
            $(this).popover({
                placement: 'right',
                trigger: 'manual'
            });
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            if (regexp.test(this.value)) {

                $(this).popover("hide");
            } else {
                $(this).popover("show");
            }

            this_popover = $(this);
            setTimeout(function () {
                this_popover.popover('hide');
            }, 2000);

        });
    },

    //carga lista de organismos
    ajaxLoadOrganismos: function (page = 1) {
        var form_search_organismo = $('#form_search_organismo');
        TML.ajax({
            url: urls.ajaxLoadOrganismos,
            data: form_search_organismo.serialize() + '&page=' + page,
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                $('#container_organismos').html(response);
                TableManager.initTable('#table_organismo', OrganismosManager.ajaxLoadOrganismos);
                OrganismosManager._initEvents();
                ImageManager.initPreviewImagen();
            }
        });
    },


    //abro el modal para crear y tambien para editar ( el mismo modal)
    ajaxLoadOrganismo: function (id) {

        TML.ajax({
            url: urls.ajaxLoadOrganismo,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                TML.fillModalContainer(response);
                $('#modal_organismo').modal('show');
                if (id == "")
                    OrganismosManager.addFieldUrlOrganismo();
                FormFielsManager.initLoadImagen();
                ImageManager.initPreviewImagen();
                OrganismosManager._initEvents();
            }
        });

    },

    //agrego campos dinamicos par las urls
    addFieldUrlOrganismo: function () {
        $("#tr-urls-organismo").append("<tr><td>" +
            "<input type=\"text\" class=\"form-control form-control-solid\" name=\"nameUrl[]\" value=\"\" required='required' /></td>" +
            "<td><input type=\"text\" class=\"form-control form-control-solid\" name=\"descripcionUrl[]\" value=\"\" required='required'  /></td>" +
            "<td><input type=\"url\" class=\"form-control form-control-solid checkurl \" name=\"urlUrl[]\" value=\"\" required='required' /></td>" +
            "<td class=\"text-end\">\n" +
            "                                                <button type=\"button\" class=\"btn btn-icon btn-flex btn-active-light-primary w-30px h-30px me-3 field_remove\" data-action=\"field_remove\">" +
            "                                                    <!--begin::Svg Icon | path: icons/duotune/general/gen027.svg-->" +
            "                                                    <span class=\"svg-icon svg-icon-3\">" +
            "                                                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\">" +
            "                                                            <path d=\"M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z\" fill=\"black\" />" +
            "                                                            <path opacity=\"0.5\" d=\"M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z\" fill=\"black\" />" +
            "                                                            <path opacity=\"0.5\" d=\"M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z\" fill=\"black\" />" +
            "                                                        </svg>" +
            "                                                    </span>" +
            "                                                </button>" +
            "</td></tr>");

    },


    saveOrganismo: function () {
        var form_organismo = $('#form_organismo');
        if (form_organismo.valid()) {
            var formData = new FormData(document.getElementById("form_organismo"));
            TML.ajax({
                url: urls.ajaxSaveOrganismo,
                data: formData,
                method: 'post',
                withFile: true,
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    console.log(response)
                    OrganismosManager.ajaxLoadOrganismos();
                    $('#modal_organismo').modal('hide');
                    TML.showSuccess();
                }
            });

        } else {
            TML.showErrorValidacion()
        }

    },


    ajaxDeleteOrganismo: function (id) {
        TML.confirm(function () {
            TML.ajax({
                url: urls.ajaxDeleteOrganismo,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {

                    $('#tr_organismo' + id).remove();
                    TML.showSuccess();
                }
            });
        });

    }
}


