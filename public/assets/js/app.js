var TML = {
    options: {
        userid: null,
        debug: false,
        locale: 'es',
        checkClientStatusUrl: null,
        complitClientUrl: null,
        checkstatus: false,
        // Contenedor generico para modals traidos por ajax.
        modal_container_id: 'modal_container',
        modal_container_aux_id: 'modal_container_aux',
        screen_locked: false,
        login_url: '/login',
        login_check: null,
        renovateSession: null,
        checking_session: false,
        timecheckingsession: 30000,
    },

    init: function (options, userid = null) {
        this.options.login_check = options.checkLogin
        this.options.renovateSession = options.renovateSession
        this.options.userid = userid;
        this.initIdleTimer();
    },

    // Inicializacion de Metronic
    _initMetronic: function () {
        // Inicializar el Metronic

    },

    // region Definicion de los eventos globales
    beforeAjaxRequest: function (xhr, callback) {
        // hacer lo que se desee con el XMLHttpRequest y el callback
        if (TML.options.debug)
            console.log('Realizando peticion AJAX: ', xhr, callback);
    },
    afterAjaxRequest: function (response, callback) {
        // hacer lo que se desee con el response y el callback
        if (TML.options.debug)
            console.log('Realizada peticion AJAX: ', response, callback);
    },
    // endregion

    // region Bloqueo de pagina
    blockPage: function (target = '', message = '') {
        if(target){
            blockUI.options.target = target;
        }
        if(message){
            blockUI.options.message = '<div class="blockui-message"><span class="spinner-border text-primary"></span>'+ message +'</div>';
        }
        if (blockUI.isBlocked() !== true) {
            blockUI.block();
            TML.options.screen_locked = true;
        }
    },
    unblockPage: function () {
        blockUI.release();
        TML.options.screen_locked = false;
    },
    // endregion

    // region Mensajes
    showSuccess: function (msg = 'Operaci&oacute;n realizada con exito!') {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        toastr.success(msg);
    },
    showError: function (msg = "Ha ocurrido un error") {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        toastr.error(msg);

    },
    showErrorValidacion: function (msg = "") {
        if (msg === "") {
            msg = 'Revise los errores en el formulario';
        }

        this.showError(msg);
    },
    // endregion

    // region Modals auxiliares
    fillModalContainer: function (html) {
        var container = $('#' + TML.options.modal_container_id);
        container
            .html('')
            .html(html);
        // Inicializar metronic o terceros

    },
    fillModalAuxContainer: function (html, initComponents, handleModalExclusion) {
        handleModalExclusion = handleModalExclusion || true;
        initComponents = initComponents || true;
        var container = $('#' + TML.options.modal_container_aux_id);
        container
            .html('')
            .html(html);
        // Inicializar los elementos, widgets, plugins de metronic o terceros
        if (handleModalExclusion) {
            container.one('hidden.bs.modal', function () {
                var main_modal = $('#' + TML.options.modal_container_id);
                $('body').addClass('modal-open');
            });
        }
        container.find('.modal').css('background', 'rgba(0, 0, 0, 0.3)');
        //background: rgba(0, 0, 0, 0.3);
    },
    // endregion

    // region Alert
    confirm: function (callback_confirm, callback_cancel, messages = '¿Está seguro que desea eliminar este elemento?') {
        swal.fire({
            text: messages,
            icon: "warning",
            buttonsStyling: !1,
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
            customClass: {
                confirmButton: "btn btn-light-primary",
                cancelButton: "btn btn-danger"
            }
        }).then(function (result) {
            if (result.value) {
                callback_confirm();
            } else {
                callback_cancel();
            }
        });
    },
    // endregion

    // region Utiles Ajax
    ajax: function (options) {
        var method = options.method || 'post';
        var blocktarget = options.blocktarget || '';
        var blockmessage = options.blockmessage || 'Cargando...';
        var async = true;
        if (options.async === false) {
            async = false;
        }
        if (['post', 'get', 'put', 'delete'].indexOf(method) === -1) method = 'post';
        var ajaxOptions = {
            url: options.url,
            data: options.data,
            async: async,
            method: method,
            beforeSend: function () {
                if (options.lockContainer) {
                    TML.blockPage(blocktarget, blockmessage);
                }
                if (options.hasOwnProperty('beforeSendCallback')) {
                    options.beforeSendCallback();
                }
            },
            success: function (responseData, responseText, xhr) {
                if ($('#kt_sign_in_form', responseData).length > 0) {
                    TML.checkSession();
                } else {
                    if (options.lockContainer) {
                        TML.unblockPage();
                    }
                    if (options.hasOwnProperty('callback')) {
                        options.callback(responseData);
                    }
                }
            },
            error: function (xhr, message, error) {
                if (options.lockContainer) {
                    TML.unblockPage();
                }
                if (options.hasOwnProperty('errorCallback')) {
                    options.errorCallback(xhr, message, error);
                }
            },
            complete: function () {
                if (options.lockContainer) {
                    TML.unblockPage();
                }
                if (options.hasOwnProperty('completeCallback')) {
                    options.completeCallback();
                }
            }
        };
        if (options.hasOwnProperty('withFile') && options.withFile === true) {
            ajaxOptions = $.extend(ajaxOptions, {
                contentType: false,
                processData: false,
                method: 'post'
            });
        }
        return $.ajax(ajaxOptions);
    },

    checkSession: function () {
        $.ajax({
            url: TML.options.login_check,
            method: 'post',
            data:{
                userid:   TML.options.userid
            },
            success: function(response){
                if(response.block){
                    TML.options.checkstatus = true;
                    TML.fillModalContainer(response.sessiontimeout);
                    $('#modal_sessiontimeout').modal({
                        backdrop: 'static',
                        keyboard: false  // to prevent closing with Esc button (if you want this too)
                    })
                    $('#modal_sessiontimeout').modal('show');

                    $('[data-action="renovateSession"]').off('click').on('click', function () {
                        TML.renovateSession();
                    });
                }
            },
        });
    },

    renovateSession: function () {
        var form_sessiontimeout = $('#form_sessiontimeout');
        if(form_sessiontimeout.valid()){
            $.ajax({
                url: TML.options.renovateSession,
                data: form_sessiontimeout.serialize(),
                method: 'post',
                beforeSend: function () {
                    TML.blockPage();
                },
                success: function (response) {
                    if(response == 'OK'){
                        $('#modal_sessiontimeout').modal('hide');
                        TML.showSuccess('La session ha sido renovada');
                        TML.options.checkstatus = false;
                    }else{
                        TML.showError('Error de credenciales');
                    }
                },
                complete: function () {
                    TML.unblockPage();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },

    initIdleTimer: function(){
        var timeoutSession;
        timeoutSession = setTimeout(function () {
            if(!TML.options.checkstatus){
                TML.checkSession();
            }
        }, TML.options.timecheckingsession);
        document.addEventListener('mousemove', function (e) {
            clearTimeout(timeoutSession);
            timeoutSession = setTimeout(function () {
                if(!TML.options.checkstatus){
                    TML.checkSession();
                }
            }, TML.options.timecheckingsession);
        }, true);
    },
    // endregion

    // region Redirecciones
    redirectWithTimer: function (url, message, delay, force, type) {
        let timerInterval
        Swal.fire({
            title: message,
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 200)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                window.location = url;
            }
        })
    },
    // endregion

    onReady: function () {

    },
};