var ClienteManager = {

    urls: null,
    expr: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    emailOk: false,
    formTargetClient: 'form_tab_add_cliente',
    formTargetEditClient: 'form_tab_edit_cliente',
    init: function (urls) {
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function () {

        $('[data-action="deleteCliente"]').off('click').on('click', function () {
            var id = $(this).data('id');
            ClienteManager.deleteCliente(id);
        });
        $('[data-action="enterFindCliente"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                ClienteManager.loadClientes();
            }
        });
        $('[data-action="selectFindCliente"]').off('change').on('change', function (e) {
            if (e.keyCode == 13) {
                ClienteManager.loadClientes();
            }
        });
        $('[data-action="findCliente"]').off('click').on('click', function () {
            ClienteManager.loadClientes();
        });
        // reset form
        $('[data-action="resetFindCliente"]').off('click').on('click', function () {
            $('#form_search_cliente')[0].reset()
            ClienteManager.loadClientes();
        });

        // add cliente
        $('[data-action="ajaxAddCliente"]').off('click').on('click', function () {
            ClienteManager.addCliente();
        });

        //save cliente
        $('[data-action="ajaxSaveNewCliente"]').off('click').on('click', function (e) {
            ClienteManager.ajaxSaveNewCliente();

        });

        //validaremail
        $('[data-action="datos-email"]').off('keyup').on('keyup', function () {
            ClienteManager.validateUniqueEmail("#email_datos")

        });

        //next step
        $('[data-action="next-step"]').off('click').on('click', function (e) {

            if ($("#" + ClienteManager.formTargetClient).valid()) {
                if (ClienteManager.validateUniqueEmail("#email_datos")) {
                    var activeTab = -1
                    var newTab = null
                    $("ul#tabs").find("li a.nav-link").each(function (index, element) {
                        if ($(element).hasClass('active') && activeTab === -1) {
                            activeTab = index;
                            $(element).removeClass('active')
                        }
                        if (activeTab >= 0 && (activeTab + 1) == index) {
                            $(element).removeClass('disabled')
                            newTab = element
                        }

                    });
                    // open tab
                    if (newTab) {
                        $(newTab).tab('show');
                    }

                }


            } else {

                TML.showErrorValidacion();
            }


        });

        //next step edit
        $('[data-action="next-step-edit"]').off('click').on('click', function (e) {

            if ($("#" + ClienteManager.formTargetEditClient).valid()) {
                    var activeTab = -1
                    var newTab = null
                    $("ul#tabs").find("li a.nav-link").each(function (index, element) {
                        if ($(element).hasClass('active') && activeTab === -1) {
                            activeTab = index;
                            $(element).removeClass('active')
                        }
                        if (activeTab >= 0 && (activeTab + 1) == index) {
                            $(element).removeClass('disabled')
                            newTab = element
                        }

                    });
                    // open tab
                    if (newTab) {
                        $(newTab).tab('show');
                    }

            } else {

                TML.showErrorValidacion();
            }


        });


        //show pass
        $('[data-password-control="visibility"]').off('click').on('click', function (e) {
            var target = $(this).data('target');
            ($(target).attr("type") == "password")
                ? $(target).attr("type", "text") : $(target).attr("type", "password")
            $(this).find('i').toggleClass("bi-eye bi-eye-slash");
        });

        //loadClienteEdit
        $('[data-action="loadClienteEdit"]').off('click').on('click', function (e) {
            ClienteManager.loadClienteEdit($(this).data('id'))
        });

        //
        $('[data-action="ajaxSaveEditCliente"]').off('click').on('click', function (e) {
            ClienteManager.ajaxSaveEditCliente($(this).data('id'))
        });


    },

    loadClientes: function (page = 1) {
        var form_search_cliente = $('#form_search_cliente');

        TML.ajax({
            url: urls.loadClientes,
            data: form_search_cliente.serialize() + '&page=' + page,
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                $('#container_clientes').html(response);
                TableManager.initTable('#table_clientes', ClienteManager.loadClientes);
                ClienteManager._initEvents();
            }
        });
    },
    deleteCliente: function (id) {
        TML.confirm(function () {
            TML.ajax({
                url: urls.deleteCliente,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function (response) {
                    $('#tr_cliente' + id).remove();
                    TML.showSuccess();
                }
            });
        });
    },
    addCliente: function () {

        TML.ajax({
            url: urls.ajaxAddCliente,
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                TML.fillModalContainer(response);
                $('#modal_add_cliente').modal('show');
                FormFielsManager.initLoadImagen();
                ImageManager.initPreviewImagen();
                FormFielsManager.dateTimePick('#fecha_caducidad_idoneidad')
                FormFielsManager.initSelec2("#ciudad", urls.ajaxSearchCiudadesSelect2, "Ciudad")

                ClienteManager._initEvents();

            }
        });

    },
    ajaxSaveNewCliente: function () {
        let rules = {
            rules: {
                password: {
                    minlength: 5
                },
                password_confirm: {
                    minlength: 5,
                    equalTo: '[name="password"]'
                },
            },
        }


        if ($("#" + ClienteManager.formTargetClient).valid(rules) && ClienteManager.emailOk) {

            let formdata = new FormData(document.getElementById(ClienteManager.formTargetClient));
            formdata.append('idcedula', $('#filecedula')[0].files[0]);
            formdata.append('idoneidad', $('#fileidoneidad')[0].files[0]);


            TML.ajax({
                url: urls.ajaxSaveNewCliente,
                data: formdata,
                lockContainer: true,
                withFile: true,
                checkResponse: true,
                callback: function (response) {
                    ClienteManager.loadClientes();
                    $('#modal_add_cliente').modal('hide');
                    TML.showSuccess();
                }
            });

        } else {
            TML.showErrorValidacion();
        }

    },

    validateUniqueEmail: function (field) {
        if (ClienteManager.expr.test($(field).val())) {

            TML.ajax({
                url: urls.ajaxCheckEmail,
                data: {
                    email: $(field).val()
                },
                lockContainer: false,
                checkResponse: true,
                callback: function (response) {
                    if (response.success) {
                        $(field).removeClass("is-invalid").addClass("is-valid");
                        $(field).next("label").text('');
                        ClienteManager.emailOk = true;

                    } else {
                        $(field).removeClass("is-valid valid").addClass("is-invalid");
                        $(field).next("label").text(jQuery.validator.messages.emailTaken);
                        $(field).next("label").css("display", "block")
                        ClienteManager.emailOk = false;
                        $('a[href="#tab_abogados"]').addClass('disabled');
                    }
                    ClienteManager._initEvents();
                }
            });


        } else {

            ClienteManager.emailOk = false;
            $(field).removeClass("is-valid valid").addClass("is-invalid");
            $(field).next("label").text(jQuery.validator.messages.email);

        }
        return ClienteManager.emailOk;

    },

    loadClienteEdit:function(id){
        TML.ajax({
            url: urls.ajaxloadClienteEdit,
            data:{id:id},
            lockContainer: true,
            checkResponse: true,
            callback: function (response) {
                TML.fillModalContainer(response);
                $('#modal_edit_cliente').modal('show');
                FormFielsManager.initLoadImagen();
                ImageManager.initPreviewImagen();
                FormFielsManager.dateTimePick('#fecha_registro')
                FormFielsManager.dateTimePick('#fecha_ultimo_acceso')
                FormFielsManager.dateTimePick('#fecha_caducidad_idoneidad')

                FormFielsManager.initSelec2("#ciudad", urls.ajaxSearchCiudadesSelect2, "Ciudad")

                ClienteManager._initEvents();

            }
        });

    },

    ajaxSaveEditCliente:function(id){

        if ($("#" + ClienteManager.formTargetEditClient).valid()) {

            let formdata = new FormData(document.getElementById(ClienteManager.formTargetEditClient));
            formdata.append('idcedula', $('#filecedula')[0].files[0]);
            formdata.append('idoneidad', $('#fileidoneidad')[0].files[0]);
            formdata.append('id', id);

            TML.ajax({
                url: urls.ajaxSaveEditCliente,
                data: formdata,
                lockContainer: true,
                withFile: true,
                checkResponse: true,
                callback: function (response) {
                    ClienteManager.loadClientes();
                    $('#modal_edit_cliente').modal('hide');
                    TML.showSuccess();
                }
            });
        }else{

            TML.showErrorValidacion();
        }

    },

}


